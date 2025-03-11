import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppStoreState {
  userID: string;
  avatar: string;
  username: string;

  setUserID(this: void, name: string): void;
  setAvatar(this: void, url: string): void;
  setUserName(this: void, username: string): void;
}

export const AppStore = create(persist<AppStoreState>(
  (set) => ({
    userID: 'none',
    avatar: '',
    username: '',

    setUserID(name) {
      set({
        userID: name,
      });
    },

    setAvatar(url) {
      set({
        avatar: url,
      });
    },
    setUserName(username) {
      set({
        username: username,
      });
    },
  }), {
    name: 'app',
  },
));
