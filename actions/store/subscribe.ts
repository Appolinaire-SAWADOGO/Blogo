import { create } from "zustand";

type useSubscribeStoreProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useSubscribeStore = create<useSubscribeStoreProps>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
