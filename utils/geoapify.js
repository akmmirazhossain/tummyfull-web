export async function getAddressFromCoords(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.features && data.features.length > 0) {
    return data.features[0].properties.formatted;
  } else {
    return "Address not found";
  }
}
