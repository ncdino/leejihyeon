import { create } from "zustand";

type View = "posts" | "profile";

type LayoutStore = {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
};

interface ViewState {
  currentView: View;
  setView: (view: View) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: "posts",
  setView: (view) => set({ currentView: view }),
}));

export const useLayoutStore = create<LayoutStore>((set) => ({
  headerHeight: 0,
  setHeaderHeight: (height) => set({ headerHeight: height }),
}));
