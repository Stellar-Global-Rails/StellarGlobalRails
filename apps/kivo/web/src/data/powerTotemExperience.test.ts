import { describe, expect, it } from 'vitest';
import { futurePowerTotemTemplates, powerTotemTemplate } from './powerTotemExperience';

describe('powerTotemExperience', () => {
  it('marks Power Totem as the only functional hackathon template', () => {
    expect(powerTotemTemplate.status).toBe('functional');
    expect(powerTotemTemplate.resourcePattern).toBe('/power-totem/{totemId}/session');
  });

  it('keeps future templates on the roadmap with the agreed names', () => {
    expect(futurePowerTotemTemplates.every((template) => template.status === 'roadmap')).toBe(true);
    expect(futurePowerTotemTemplates.map((template) => template.name)).toEqual([
      'API Toll',
      'Data Gate',
      'Agent Tool Paywall',
      'Device Command',
      'Compute Meter',
      'Storage Unlock',
      'Automation Trigger',
      'Private Flow Template',
    ]);
  });
});
