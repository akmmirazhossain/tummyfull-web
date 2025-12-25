// components/map/DeliveryRouteMap.js
import React, { useEffect, useRef } from "react";

const DeliveryRouteMap = ({ deliveries, startLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Wait for Google Maps to load
    if (!window.google || !mapRef.current) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#4285F4",
        strokeWeight: 5,
      },
      provideRouteAlternatives: false, // ✅ Only show best route
    });

    const map = new google.maps.Map(mapRef.current, {
      zoom: 14,
      center: startLocation,
      mapTypeControl: true,
      streetViewControl: false,
    });

    directionsRenderer.setMap(map);

    // If no deliveries, just show start location
    if (!deliveries || deliveries.length === 0) {
      new google.maps.Marker({
        position: startLocation,
        map: map,
        title: "Your Location",
      });
      return;
    }

    // Prepare waypoints (all stops except the last one)
    const waypoints = deliveries.slice(0, -1).map((point) => ({
      location: { lat: point.lat, lng: point.lng },
      stopover: true,
    }));

    // Last delivery is the destination
    const destination = deliveries[deliveries.length - 1];

    // Request optimized route
    directionsService.route(
      {
        origin: startLocation,
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypoints,
        optimizeWaypoints: true, // ✅ Google optimizes the order!
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);

          // Get optimized order
          const optimizedOrder = result.routes[0].waypoint_order;
          console.log("📍 Optimized delivery order:", optimizedOrder);

          // Calculate total distance and duration
          const route = result.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach((leg) => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });

          console.log(
            "🚗 Total distance:",
            (totalDistance / 1000).toFixed(2),
            "km"
          );
          console.log(
            "⏱️ Total duration:",
            Math.round(totalDuration / 60),
            "minutes"
          );

          // You can pass this info back to parent component if needed
          // onRouteCalculated({ optimizedOrder, totalDistance, totalDuration });
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [deliveries, startLocation]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-gray-300"
    />
  );
};

export default DeliveryRouteMap;
