import React, { useState, useEffect } from "react";

const LocationPicker = () => {
  // State management for location data
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  /**
   * Fetch user's location from IP address via backend API
   */
  const fetchLocationFromIP = async () => {
    try {
      setIsLoadingLocation(true);
      setLocationError(null);

      // Call Laravel backend API to get location from IP
      const apiResponse = await fetch(
        "http://192.168.0.216/dalbhath-backend/public/api/ip",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API returned status: ${apiResponse.status}`);
      }

      const locationResult = await apiResponse.json();

      // Process successful location data
      if (locationResult.success && locationResult.data) {
        setUserLocation(locationResult.data);
        console.log("Location detected:", locationResult.data);
      } else {
        throw new Error(locationResult.message || "Unable to detect location");
      }
    } catch (error) {
      console.error("Location detection error:", error);
      setLocationError("Could not detect your location. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * Auto-fetch location on component mount
   */
  useEffect(() => {
    fetchLocationFromIP();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Your Location</h2>

      {/* Loading state */}
      {isLoadingLocation && (
        <p style={{ color: "#666" }}>🔍 Detecting your location...</p>
      )}

      {/* Error state */}
      {locationError && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          {locationError}
        </div>
      )}

      {/* Location display */}
      {userLocation && !isLoadingLocation && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>City:</strong> {userLocation.city || "Unknown"}
          </p>
          <p>
            <strong>Region:</strong> {userLocation.region || "Unknown"}
          </p>
          <p>
            <strong>Country:</strong> {userLocation.country || "Unknown"}
          </p>
          <p>
            <strong>Coordinates:</strong> {userLocation.latitude},{" "}
            {userLocation.longitude}
          </p>
        </div>
      )}

      {/* Retry button */}
      <button
        onClick={fetchLocationFromIP}
        disabled={isLoadingLocation}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoadingLocation ? "not-allowed" : "pointer",
          opacity: isLoadingLocation ? 0.6 : 1,
        }}
      >
        {isLoadingLocation ? "Detecting..." : "🌐 Detect Location"}
      </button>
    </div>
  );
};

export default LocationPicker;
