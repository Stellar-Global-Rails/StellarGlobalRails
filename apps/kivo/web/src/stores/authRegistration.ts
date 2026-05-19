export interface RegistrationOutcome {
  requiresEmailConfirmation: boolean;
}

interface SupabaseSignUpLike {
  user: unknown | null;
  session: unknown | null;
}

export const getRegistrationOutcome = (data: SupabaseSignUpLike): RegistrationOutcome => ({
  requiresEmailConfirmation: Boolean(data.user && !data.session),
});
