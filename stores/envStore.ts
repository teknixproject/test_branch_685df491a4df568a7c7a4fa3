import { create } from 'zustand';

export type EnvItem = {
  key: string;
  value: string;
};

export interface EnvState {
  items: EnvItem[];
  setItems: (items: EnvItem[]) => void;
  getItems: () => EnvItem[];
}

export const useEnvStore = create<EnvState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  getItems() {
    return get().items;
  },
}));
