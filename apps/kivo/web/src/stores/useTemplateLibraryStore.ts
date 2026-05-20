import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getAvailableTemplates, getTemplateById } from '@/data/templateMarketplace';

export interface TemplateLibraryItem {
  templateId: string;
  acquiredAt: string;
}

interface TemplateLibraryState {
  items: TemplateLibraryItem[];
  acquireTemplate: (templateId: string) => void;
  hasTemplate: (templateId: string) => boolean;
}

export const useTemplateLibraryStore = create<TemplateLibraryState>()(
  persist(
    (set, get) => ({
      items: [],
      acquireTemplate: (templateId) => {
        const template = getTemplateById(templateId);
        if (!template || template.availability !== 'available' || get().items.some((item) => item.templateId === templateId)) {
          return;
        }
        set((state) => ({
          items: [...state.items, { templateId, acquiredAt: new Date().toISOString() }],
        }));
      },
      hasTemplate: (templateId) => get().items.some((item) => item.templateId === templateId),
    }),
    {
      name: 'kivo-template-library',
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const availableIds = new Set(getAvailableTemplates().map((template) => template.id));
        const persisted = persistedState as Partial<TemplateLibraryState> | undefined;
        const items = (persisted?.items ?? []).filter((item) => availableIds.has(item.templateId));
        return { ...currentState, items };
      },
    },
  ),
);
