import { create } from "zustand";

type UserStore = {
  user: boolean;
  setUser: (value: boolean) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: false,
  setUser: (value) => set({ user: value }),
  logout: () => set({ user: false }),
}));
