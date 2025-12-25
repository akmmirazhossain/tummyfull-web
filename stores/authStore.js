// stores/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";

export const useAuthStore = create((set) => ({
  customerToken: Cookies.get("customerSessionToken") || null,

  setToken: (t) => {
    Cookies.set("customerSessionToken", t, { expires: 120 }); // Match AuthGate's 120 days
    set({ customerToken: t });
  },

  clearToken: () => {
    Cookies.remove("customerSessionToken");
    set({ customerToken: null });
  },
}));
