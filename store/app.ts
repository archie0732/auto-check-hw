import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppStoreState {
  user: string;

  setUser(this: void, name: string): void;
}

export const AppStore = create(persist<AppStoreState>(
  (set) => ({
    user: 'none',
    setUser(name) {
      set({
        user: name,
      });
    },
  }), {
    name: 'app',
  },
));
