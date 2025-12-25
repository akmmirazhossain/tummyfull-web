import { useEffect, useState, useRef } from "react";

export default function DistanceCalculator({
  point1,
  point2,
  onDistanceCalculated,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasCalculated = useRef(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps API with geometry library
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyACdrKIra9w4LKdTR8lDLyg3ngKvW_Fpv0&libraries=geometry";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && point1 && point2 && !hasCalculated.current) {
      calculateDistance();
      hasCalculated.current = true;
    }
  }, [isLoaded, point1, point2]);

  const calculateDistance = () => {
    const location1 = new window.google.maps.LatLng(point1.lat, point1.lng);
    const location2 = new window.google.maps.LatLng(point2.lat, point2.lng);

    // Distance in meters
    const distanceInMeters =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        location1,
        location2
      );

    // Convert to kilometers
    const distanceInKm = (distanceInMeters / 1000).toFixed(2);

    const distanceData = {
      meters: distanceInMeters.toFixed(2),
      kilometers: distanceInKm,
    };

    console.log(
      `Distance: ${distanceData.meters} meters (${distanceData.kilometers} km)`
    );

    // Send data back to parent
    if (onDistanceCalculated) {
      onDistanceCalculated(distanceData);
    }
  };

  return null;
}
