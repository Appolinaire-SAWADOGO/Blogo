import { create } from "zustand";

type useCategoryStoreProps = {
  categoryStore: "all" | "technology" | "gaming";
  setAllStore: () => void;
  setTechnologyStore: () => void;
  setGamingStore: () => void;
};

export const useCategoryStore = create<useCategoryStoreProps>((set) => ({
  categoryStore: "all",
  setAllStore: () => set({ categoryStore: "all" }),
  setTechnologyStore: () => set({ categoryStore: "technology" }),
  setGamingStore: () => set({ categoryStore: "gaming" }),
}));
