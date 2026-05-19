import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import { getRegistrationOutcome } from './authRegistration';
import type { RegistrationOutcome } from './authRegistration';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'developer' | 'admin';
  organization: string;
}

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  authMode: 'supabase';
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<RegistrationOutcome>;
  logout: () => Promise<void>;
}

const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase Auth precisa estar configurado para rodar o Kivo com autenticacao real.');
  }
  return supabase;
};

const fromSupabaseUser = (user: User): AppUser => ({
  id: user.id,
  name: typeof user.user_metadata.name === 'string' ? user.user_metadata.name : user.email?.split('@')[0] ?? 'Operador Kivo',
  email: user.email ?? '',
  role: 'developer',
  organization: typeof user.user_metadata.organization === 'string' ? user.user_metadata.organization : '',
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: Boolean(supabase),
  authMode: 'supabase',
  initialize: async () => {
    if (!supabase) {
      set({ user: null, loading: false });
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      set({ user: null, loading: false });
      return;
    }

    set({ user: fromSupabaseUser(data.user), loading: false });
  },
  login: async (email: string, password: string) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    if (!data.user) {
      throw new Error('Supabase Auth nao retornou usuario.');
    }
    set({ user: fromSupabaseUser(data.user), loading: false });
  },
  register: async (name: string, email: string, password: string) => {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      throw error;
    }
    if (!data.user) {
      throw new Error('Supabase Auth nao retornou usuario.');
    }
    const outcome = getRegistrationOutcome(data);
    if (!outcome.requiresEmailConfirmation) {
      set({ user: fromSupabaseUser(data.user), loading: false });
    } else {
      set({ user: null, loading: false });
    }
    return outcome;
  },
  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({ user: null });
  },
}));
