// app/page.js
import GeoMap from "./components/GeoMap";

export default function Home() {
  return (
    <div>
      <h1>My Current Location</h1>
      <GeoMap />
    </div>
  );
}
