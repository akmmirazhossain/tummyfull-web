// pages/components/map/GetUserGps.js

"use client";
import { useEffect } from "react";

export default function GetUserGps({
  onCoordinates,
  setLocationAccessible, // optional
  setLocationMessage, // optional
}) {
  useEffect(() => {
    if (!navigator.geolocation) {
      if (setLocationAccessible) setLocationAccessible(false);
      if (setLocationMessage) setLocationMessage(true);
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (setLocationAccessible) setLocationAccessible(true);
        if (setLocationMessage) setLocationMessage(false);

        if (onCoordinates) {
          onCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      },
      (error) => {
        if (setLocationAccessible) setLocationAccessible(false);
        if (setLocationMessage) setLocationMessage(true);
        console.log("Location unavailable", error);
      }
    );
  }, [onCoordinates, setLocationAccessible, setLocationMessage]);

  return null;
}
