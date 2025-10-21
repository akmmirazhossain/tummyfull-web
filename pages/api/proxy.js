import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "URL missing" });

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
