import { describe, expect, it } from 'vitest';
import {
  communityTemplates,
  getAvailableTemplates,
  getComingSoonTemplates,
  getOwnedTemplates,
  getTemplateById,
  templateCatalog,
} from './templateMarketplace';

describe('templateMarketplace', () => {
  it('keeps Power Totem as the only available hackathon template', () => {
    const available = getAvailableTemplates();

    expect(available).toHaveLength(1);
    expect(available[0]).toMatchObject({
      id: 'power-totem',
      availability: 'available',
    });
  });

  it('keeps the rest of the marketplace as coming soon', () => {
    const soon = getComingSoonTemplates();

    expect(soon.length).toBe(templateCatalog.length - 1);
    expect(soon.every((template) => template.id !== 'power-totem')).toBe(true);
    expect(soon.every((template) => template.acquisitionLabel === 'Em breve')).toBe(true);
  });

  it('starts the community shelf empty until users publish public templates', () => {
    expect(communityTemplates).toEqual([]);
  });

  it('returns only catalog templates owned by the workspace', () => {
    expect(getTemplateById('power-totem')?.name).toBe('Power Totem');
    expect(getOwnedTemplates(['missing', 'power-totem']).map((template) => template.id)).toEqual(['power-totem']);
  });
});
