import { useEffect } from "react";

export default function GeolocationTracker({
  onGeoLocationUpdate,
  onError,
  useGoogleAPI = false,
}) {
  const GOOGLE_API_KEY = "AIzaSyACdrKIra9w4LKdTR8lDLyg3ngKvW_Fpv0";

  useEffect(() => {
    if (useGoogleAPI) {
      getLocationViaGoogleAPI();
    } else {
      getLocationViaBrowser();
    }
  }, []);

  const getLocationViaBrowser = () => {
    if (!navigator.geolocation) {
      if (onError) {
        onError("Geolocation is not supported by your browser");
      }
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          source: "browser",
        };

        console.log("Location obtained (Browser):", locationData);

        if (onGeoLocationUpdate) {
          onGeoLocationUpdate(locationData);
        }
      },
      (error) => {
        handleGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getLocationViaGoogleAPI = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Google Geolocation API request failed");
      }

      const data = await response.json();

      const locationData = {
        lat: data.location.lat,
        lng: data.location.lng,
        accuracy: data.accuracy,
        timestamp: Date.now(),
        source: "google",
      };

      // console.log("Location obtained (Google API):", locationData);

      if (onGeoLocationUpdate) {
        onGeoLocationUpdate(locationData);
      }
    } catch (error) {
      console.error("Google Geolocation error:", error);
      if (onError) {
        onError(error.message);
      }
    }
  };

  const handleGeolocationError = (error) => {
    let errorMessage = "";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied location permission";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out";
        break;
      default:
        errorMessage = "Unknown error occurred";
    }

    console.error("Geolocation error:", errorMessage);

    if (onError) {
      onError(errorMessage);
    }
  };

  return null;
}
