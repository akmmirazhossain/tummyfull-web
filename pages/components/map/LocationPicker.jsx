// pages/components/map/LocationPicker.jsx

import { useState, useEffect, useRef } from "react";
import { Input, Button, Card, Typography, Space, Spin } from "antd";
import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Global flag to track if Google Maps is loading
let isGoogleMapsLoading = false;
let googleMapsLoadedCallbacks = [];

export default function LocationPicker({
  onLocationSelect,
  defaultLat,
  defaultLng,
  userAddressLat,
  userAddressLon,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geocoderRef = useRef(null);
  const isMapInitialized = useRef(false);
  const isInitialLoad = useRef(true); // Track if this is the initial load
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);

  // Detect user location based on IP
  useEffect(() => {
    // Priority 1: Use provided user address if available
    if (userAddressLat && userAddressLon) {
      setCoordinates({
        lat: userAddressLat,
        lng: userAddressLon,
      });
      setLocationDetected(true);
      return;
    }

    // Priority 2: Auto-detect location
    const detectLocation = async () => {
      try {
        // Try browser geolocation first (more accurate)
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setLocationDetected(true);
            },
            async () => {
              // If browser geolocation fails, fallback to IP-based
              await fetchLocationByIP();
            }
          );
        } else {
          // Browser doesn't support geolocation, use IP
          await fetchLocationByIP();
        }
      } catch (error) {
        console.error("Location detection error:", error);
        // Use provided defaults or fallback coordinates
        setCoordinates({
          lat: defaultLat || 23.8103,
          lng: defaultLng || 90.4125,
        });
        setLocationDetected(true);
      }
    };

    const fetchLocationByIP = async () => {
      try {
        const isDevelopment = process.env.NODE_ENV === "development";

        const apiUrl = isDevelopment
          ? `${process.env.NEXT_PUBLIC_API_URL}/ip?dev=true`
          : `${process.env.NEXT_PUBLIC_API_URL}/ip`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.success && result.data?.latitude && result.data?.longitude) {
          setCoordinates({
            lat: result.data.latitude,
            lng: result.data.longitude,
          });
          setLocationDetected(true);
        } else {
          throw new Error("Invalid location data from backend");
        }
      } catch (error) {
        console.error("Backend location API error:", error);

        // Only fallback if props provided, otherwise show error
        if (defaultLat && defaultLng) {
          setCoordinates({ lat: defaultLat, lng: defaultLng });
          setLocationDetected(true);
        } else {
          // Show error to user - map can't load without coordinates
          setLocationDetected(false);
          setLoading(false);
        }
      }
    };

    detectLocation();
  }, [defaultLat, defaultLng, userAddressLat, userAddressLon]);

  useEffect(() => {
    if (!locationDetected || !coordinates || isMapInitialized.current) return;

    const loadGoogleMapsScript = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      // Check if script is already in the document
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );

      if (existingScript) {
        // Script exists, wait for it to load
        if (isGoogleMapsLoading) {
          // Add callback to queue
          googleMapsLoadedCallbacks.push(initMap);
        } else {
          // Script already loaded, init immediately
          initMap();
        }
        return;
      }

      // Set loading flag
      isGoogleMapsLoading = true;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isGoogleMapsLoading = false;
        initMap();
        // Execute all queued callbacks
        googleMapsLoadedCallbacks.forEach((callback) => callback());
        googleMapsLoadedCallbacks = [];
      };
      script.onerror = () => {
        isGoogleMapsLoading = false;
        setLoading(false);
        console.error("Failed to load Google Maps script");
        googleMapsLoadedCallbacks = [];
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || isMapInitialized.current || !window.google) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        gestureHandling: "greedy",
      });

      const geocoder = new google.maps.Geocoder();

      mapInstanceRef.current = map;
      geocoderRef.current = geocoder;
      isMapInitialized.current = true;

      // Initial geocode - but don't trigger callback
      reverseGeocode(coordinates.lat, coordinates.lng, true);

      // Listen to map center changes (when user drags the map)
      map.addListener("center_changed", () => {
        const center = map.getCenter();
        if (center) {
          const lat = center.lat();
          const lng = center.lng();
          setCoordinates({ lat, lng });
        }
      });

      // Mark initial load as complete after first interaction
      map.addListener("dragstart", () => {
        isInitialLoad.current = false;
      });

      // Debounce geocoding to avoid too many API calls while dragging
      let geocodeTimeout;
      map.addListener("idle", () => {
        clearTimeout(geocodeTimeout);
        geocodeTimeout = setTimeout(() => {
          const center = map.getCenter();
          if (center) {
            reverseGeocode(center.lat(), center.lng(), false);
          }
        }, 500);
      });

      setLoading(false);
    };

    const reverseGeocode = async (lat, lng, isInitial = false) => {
      try {
        const result = await geocoderRef.current.geocode({
          location: { lat, lng },
        });

        if (result.results[0]) {
          const formattedAddress = result.results[0].formatted_address;
          setAddress(formattedAddress);

          // Trigger callback on initial load AND on user interaction
          if (onLocationSelect) {
            onLocationSelect({
              address: formattedAddress,
              lat,
              lon: lng,
              placeId: result.results[0].place_id,
            });
          }
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setAddress("Unable to fetch address");
      }
    };

    loadGoogleMapsScript();
  }, [locationDetected, coordinates, onLocationSelect]);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const searchAddress = async () => {
    if (!address.trim() || !geocoderRef.current) return;

    isInitialLoad.current = false; // Mark as user interaction

    try {
      const result = await geocoderRef.current.geocode({ address });

      if (result.results[0]) {
        const location = result.results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        setCoordinates({ lat, lng });
        mapInstanceRef.current?.setCenter({ lat, lng });

        const formattedAddress = result.results[0].formatted_address;
        setAddress(formattedAddress);

        if (onLocationSelect) {
          onLocationSelect({
            address: formattedAddress,
            lat,
            lon: lng,
            placeId: result.results[0].place_id,
          });
        }
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="shadow-lg">
      <Space orientation="vertical" size="large" className="w-full">
        {/* <Input.Search
          placeholder="Enter an address to search..."
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          }
          value={address}
          onChange={handleAddressChange}
          onSearch={searchAddress}
        /> */}

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 rounded">
              <Space orientation="vertical" align="center">
                <Spin size="large" />
                <Text>Detecting your location...</Text>
              </Space>
            </div>
          )}

          {/* Fixed center pin */}
          <div className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none left-1/2 top-1/2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-lg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                fill="#EF4444"
              />
              <circle cx="12" cy="9" r="2.5" fill="white" />
            </svg>
          </div>

          <div ref={mapRef} className="w-full rounded h-96"></div>
        </div>
      </Space>
    </div>
  );
}
