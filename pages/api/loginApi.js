export default function handler(req, res) {
  const { method } = req;
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { username, password } = req.body;

  // Dummy user data
  const user = {
    username: "user",
    password: "1234",
  };

  if (username === user.username && password === user.password) {
    // In real scenario, use a token or session management
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
