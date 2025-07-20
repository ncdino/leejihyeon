import { create } from "zustand";
import apiClient from "@/app/_services/api";

interface AuthState {
  isLogin: boolean;
  authChecked: boolean;
  checkLoginStatus: () => Promise<void>;
  logout: () => void;
}

// authchecked: 상태 확인 완료 여부
export const useAuthStore = create<AuthState>((set) => ({
  isLogin: false,
  authChecked: false,
  checkLoginStatus: async () => {
    try {
      await apiClient.get("/api/auth/me");
      set({ isLogin: true, authChecked: true });
    } catch {
      set({ isLogin: false, authChecked: true });
    }
  },
  logout: async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      set({ isLogin: false, authChecked: true });
      window.location.reload();
    }
  },
}));
