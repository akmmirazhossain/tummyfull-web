// pages/components/kitchens/KitchensNearest.js

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { useVisibilityChange } from "@uidotdev/usehooks";
import { createLogger } from "../../../lib/logger";
const logger = createLogger("KitchensNearest");

export default function KitchensNearest({
  userLatitude,
  userLongitude,
  onKitchensUpdate,
  getLastOrderKitchenId,
}) {
  const [loading, setLoading] = useState(false);
  const { user, loadingUser, error, isLoggedIn, refreshUser, loginToken } =
    useUser();
  const documentVisible = useVisibilityChange();

  useEffect(() => {
    if (!userLatitude || !userLongitude) return; // wait for coordinates

    const fetchKitchens = async () => {
      setLoading(true);
      try {
        // const payload = { lat: 22.49593479665983, lon: 78.72391765048958 };

        const payload = { lat: userLatitude, lon: userLongitude };

        if (loginToken != null) {
          payload.loginToken = loginToken;
        }

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/kitchens`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        const data = res.data;
        if (data.status === "success" && Array.isArray(data.data)) {
          const sortedKitchens = data.data.sort(
            (a, b) => a.kitchenDistance - b.kitchenDistance
          );
          onKitchensUpdate(sortedKitchens);

          logger.api("sortedKitchens", sortedKitchens);

          const getLastOrderKitchenId = data.getLastOrderKitchenId;

          logger.api("getLastOrderKitchenId", getLastOrderKitchenId);

          if (getLastOrderKitchenId != null && getLastOrderKitchenId != "") {
            //IF AT LEAST ONE ORDER WAS PLACED
            localStorage.setItem(
              "selectedKitchenId",
              data.getLastOrderKitchenId
            );

            logger.api(
              "//IF AT LEAST ONE ORDER WAS PLACED data.getLastOrderKitchenId",
              data.getLastOrderKitchenId
            );
            return;
          }

          if (sortedKitchens[0]?.kitchenId != null) {
            //NEW USER OR IF NO ORDERS WERE PLACED
            localStorage.setItem(
              "selectedKitchenId",
              sortedKitchens[0]?.kitchenId
            );

            logger.api(
              "NEW USER OR IF NO ORDERS WERE PLACED sortedKitchens[0]?.kitchenId",
              sortedKitchens[0]?.kitchenId
            );
            return;
          }
          //IF THE USER HAS NO KITCHEN NEARBY
          localStorage.setItem("selectedKitchenId", 1);
          localStorage.setItem("noKitchenNearby", true);
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchKitchens();
  }, [userLatitude, userLongitude, onKitchensUpdate, documentVisible]);

  return null; // This component doesn't render anything
}
