// store/kitchenStore.js
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

//CONSOLE LOG SWITCH
const log = 1 ? console.log : () => {};

export const useKitchenStore = create((set, get) => ({
  nearbyKitchens: [],
  loadingNearby: true,
  lastOrderKitchenId: null,

  kitchenDetails: null,
  loadingDetails: false,

  fetchNearbyKitchens: async (lat, lon, customerToken = null) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Set loading state
    set({ loadingNearby: true });

    try {
      // Build params - customerToken is optional for guests
      const params = { lat, lon };
      if (customerToken) {
        params.customerToken = customerToken;
      }

      const res = await axios.get(`${apiUrl}customer/kitchen/nearby`, {
        params,
      });

      if (res.data?.status === "success") {
        set({
          nearbyKitchens: res.data.data, // Fixed: was 'kitchens'
          lastOrderKitchenId: res.data.getLastOrderKitchenId || null,
        });
        log("Nearby kitchens fetched:", res.data.data.length);
      } else {
        set({ nearbyKitchens: [], lastOrderKitchenId: null });
      }
    } catch (err) {
      log("Error fetching nearby kitchens:", err);
      set({ nearbyKitchens: [], lastOrderKitchenId: null });
    } finally {
      set({ loadingNearby: false }); // Fixed: was 'loadingKitchens'
    }
  },

  initNearbyKitchens: (lat, lon) => {
    log("Initializing nearby kitchens with lat:", lat, "lon:", lon);
    const customerToken = useAuthStore.getState().customerToken;

    if (lat && lon) {
      get().fetchNearbyKitchens(lat, lon, customerToken);
    } else {
      log("No location provided");
      set({ loadingNearby: false }); // Fixed: was 'loadingKitchens'
    }
  },

  fetchKitchenDetails: async (kitchenId, customerToken = null) => {
    // ... fetch from /kitchens/:id
  },
}));
