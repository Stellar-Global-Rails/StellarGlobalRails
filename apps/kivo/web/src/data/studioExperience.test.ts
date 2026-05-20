import { describe, expect, it } from 'vitest';
import { gatewayModes, studioAgents, studioSteps, studioTemplates } from './studioExperience';

describe('studioExperience', () => {
  it('marks only Power Totem as the functional hackathon template', () => {
    const functionalTemplates = studioTemplates.filter((template) => template.status === 'functional');

    expect(functionalTemplates).toHaveLength(1);
    expect(functionalTemplates[0]).toMatchObject({
      id: 'power-totem',
      isFunctionalHackathonTemplate: true,
    });
  });

  it('keeps future templates visibly out of the ready product surface', () => {
    const futureTemplates = studioTemplates.filter((template) => template.id !== 'power-totem');

    expect(futureTemplates.length).toBeGreaterThan(0);
    expect(futureTemplates.every((template) => template.status !== 'functional')).toBe(true);
    expect(futureTemplates.every((template) => template.isFunctionalHackathonTemplate === false)).toBe(true);
  });

  it('covers AI agents, gateway modes, and the full Studio journey', () => {
    expect(studioAgents.map((agent) => agent.id)).toEqual([
      'discovery',
      'flow_architect',
      'gateway',
      'sdk',
      'validation',
      'launch',
    ]);
    expect(gatewayModes.some((mode) => mode.id === 'raspberry')).toBe(true);
    expect(gatewayModes.some((mode) => mode.id === 'api_guard')).toBe(true);
    expect(studioSteps.map((step) => step.id)).toEqual(['describe', 'gateway', 'flow', 'sdk', 'validate', 'launch']);
  });
});
