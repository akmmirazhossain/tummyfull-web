// stores/menuStore.js
import { create } from "zustand";
import axios from "axios";

import { useAuthStore } from "./authStore";

//CONSOLE LOG SWITCH
const log = 0 ? console.log : () => {};

export const useOwnerStore = create((set, get) => ({
  ownerData: null,
  loadingOwner: true,
  loadedOwner: false,
  sessionToken: null,
  isLoggedIn: false,

  fetchOwner: async (sessionToken) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      // logger.api("Owner RES", sessionToken);
      const res = await axios.get(`${apiUrl}kitchen/owner/fetch`, {
        params: { sessionToken },
      });

      if (res.data?.success === true) {
        set({
          ownerData: res.data.data.ownerData,
          isLoggedIn: true,
        });
        log("Owner RES", res.data);
      } else {
        set({ ownerData: null, isLoggedIn: false });
      }
    } catch (err) {
      set({ ownerData: null, isLoggedIn: false });
    }

    set({ loadingOwner: false, loadedOwner: true });
  },

  initOwner: (token) => {
    const sessionToken = token || useAuthStore.getState().token;
    if (sessionToken) {
      set({ sessionToken: sessionToken });
      get().fetchOwner(sessionToken);
    } else {
      set({ loadingOwner: false });
    }
  },
}));
