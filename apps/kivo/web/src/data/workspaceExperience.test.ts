import { describe, expect, it } from 'vitest';
import { accountScales, personaJourneys } from './workspaceExperience';

describe('workspace experience model', () => {
  it('covers the MVP personas and account scales', () => {
    expect(personaJourneys.map((persona) => persona.id)).toEqual(['operator', 'payer', 'integrator', 'finance']);
    expect(accountScales.map((scale) => scale.id)).toEqual(['solo', 'team', 'enterprise']);
    expect(personaJourneys.every((persona) => persona.primaryRoute.startsWith('/'))).toBe(true);
  });
});
