export default function NavigateToDestination({
  destination,
  travelMode,
  buttonText,
  buttonClass = "bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold",
}) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}&travelmode=${travelMode}`;

  return (
    <a href={mapsUrl} className={buttonClass}>
      {buttonText}
    </a>
  );
}
