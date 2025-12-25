import { useRef, useState } from "react";
import ReverseGeocodingMap from "./components/map/ReverseGeocodingMap";

export default function ParentPage() {
  const mapRef = useRef(null);
  const [addressData, setAddressData] = useState(null);

  const handleAddressChange = (data) => {
    setAddressData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text_black">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Map Container */}
          <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border-2 border-gray-300 mb-6"
          />

          {/* Your custom HTML using addressData */}
          {addressData && (
            <div>
              <p>Address: {addressData.formatted}</p>
              <p>
                Lat: {addressData.lat}, Lon: {addressData.lon}
              </p>
            </div>
          )}
        </div>
      </div>

      <ReverseGeocodingMap
        initialLat={23.82424980000001}
        initialLon={90.42984401593858}
        onAddressChange={handleAddressChange}
        mapRef={mapRef}
      />
    </div>
  );
}
