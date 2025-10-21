"use client";

import React, { useEffect, useRef, useState } from "react";

const GeoMap = () => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Avoid loading the script multiple times
    if (!document.getElementById("geoapify-script")) {
      const script = document.createElement("script");
      script.id = "geoapify-script";
      script.src = `https://maps.geoapify.com/v1/javascript/api.js?apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`;
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => initMap();
    } else {
      initMap();
    }

    function initMap() {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          // Make sure GeoapifyMaps is available
          if (!window.GeoapifyMaps) {
            console.error("GeoapifyMaps not loaded yet");
            return;
          }

          const map = new window.GeoapifyMaps.Map({
            container: mapRef.current,
            center: [longitude, latitude],
            zoom: 15,
            apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
          });

          new window.GeoapifyMaps.Marker([longitude, latitude]).addTo(map);

          setLoading(false);
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  return (
    <div>
      {loading && <p>Loading map...</p>}
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default GeoMap;
