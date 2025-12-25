// pages/api/reverse-geocode.js

export default async function handler(req, res) {
  const { lat, lng } = req.query;

  // Check if coordinates are provided
  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  // Get Geoapify API key from environment variables
  const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Geoapify API key not configured" });
  }

  try {
    // Call Geoapify Reverse Geocoding API
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${API_KEY}`
    );

    const data = await response.json();

    // Check if we got results
    if (data.features && data.features.length > 0) {
      const properties = data.features[0].properties;

      // Build a formatted address from the properties
      const addressParts = [
        properties.housenumber,
        properties.street,
        properties.suburb || properties.district,
        properties.city,
        properties.state,
        properties.postcode,
        properties.country,
      ].filter((part) => part); // Remove undefined/null values

      const address = addressParts.join(", ");

      return res.status(200).json({
        address: address || properties.formatted,
        details: properties, // Send full details if you want more info
      });
    } else {
      return res
        .status(404)
        .json({ error: "No address found for these coordinates" });
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return res.status(500).json({ error: "Failed to fetch address" });
  }
}
