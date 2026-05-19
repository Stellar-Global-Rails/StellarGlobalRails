import { describe, expect, it } from 'vitest';
import { getRegistrationOutcome } from './authRegistration';

describe('getRegistrationOutcome', () => {
  it('marks Supabase signups without a session as waiting for e-mail confirmation', () => {
    const outcome = getRegistrationOutcome({
      user: { id: 'user-1' },
      session: null,
    });

    expect(outcome.requiresEmailConfirmation).toBe(true);
  });

  it('marks Supabase signups with a session as ready for the console', () => {
    const outcome = getRegistrationOutcome({
      user: { id: 'user-1' },
      session: { access_token: 'token' },
    });

    expect(outcome.requiresEmailConfirmation).toBe(false);
  });
});
