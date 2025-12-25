// pages/components/map/ReverseGeocodingMap.js
import { useState, useEffect, useRef } from "react";

export default function ReverseGeocodingMap({
  initialLat,
  initialLon,
  onAddressChange,
  mapClicked,
  mapRef,
}) {
  const [addressData, setAddressData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    console.log("FIRST useEffect LOADED");
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Load Google Maps API
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyACdrKIra9w4LKdTR8lDLyg3ngKvW_Fpv0&callback=initMap";
      script.async = true;
      script.defer = true;

      // Make initMap available globally
      window.initMap = initializeMap;

      document.body.appendChild(script);

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  const initializeMap = () => {
    console.log("initializeMap LOADED");
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Google Map
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: initialLat, lng: initialLon },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Add initial marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat: initialLat, lng: initialLon },
      map: map,
      title: "Selected Location",
    });

    // Fetch address for initial coordinates
    fetchAddressData(initialLat, initialLon);

    // Add click event to map
    map.addListener("click", (e) => {
      handleMapClick(e.latLng.lat(), e.latLng.lng());
    });
  };

  //MARK: Map Clicked
  const handleMapClick = async (lat, lng) => {
    console.log("MAP CLICKED");

    // Remove existing marker if any
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: mapInstanceRef.current,
      title: "Selected Location",
    });

    // Fetch address data
    await fetchAddressData(lat, lng);

    mapClicked(true);

    setTimeout(() => {
      mapClicked(false);
    }, 500);

    // Now set map clicked to true AFTER address is fetched
  };

  const fetchAddressData = async (lat, lng) => {
    setLoading(true);
    setError(null);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat: lat, lng: lng };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            const result = results[0];
            // console.log("🚀 ~ fetchAddressData ~ result:", result);

            // Extract address components
            const addressComponents = result.address_components;
            let street = "";
            let suburb = "";
            let city = "";
            let quarter = "";

            addressComponents.forEach((component) => {
              if (component.types.includes("route")) {
                street = component.long_name;
              }
              if (
                component.types.includes("sublocality") ||
                component.types.includes("sublocality_level_1")
              ) {
                suburb = component.long_name;
              }
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
              if (component.types.includes("neighborhood")) {
                quarter = component.long_name;
              }
            });

            const addressInfo = {
              formatted: result.formatted_address || "N/A",
              street: street || "N/A",
              quarter: quarter || "N/A",
              suburb: suburb || "N/A",
              city: city || "N/A",
              address_line1: street || "N/A",
              address_line2: result.formatted_address || "N/A",
              lat: lat,
              lon: lng,
            };

            setAddressData(addressInfo);

            // Send data back to parent
            if (onAddressChange) {
              onAddressChange(addressInfo);
            }
          } else {
            setError("No results found");
          }
        } else {
          setError("Geocoder failed: " + status);
        }
        setLoading(false);
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return null;
}
