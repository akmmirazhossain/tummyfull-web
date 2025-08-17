// pages/send-whatsapp.tsx
import { useState } from "react";

export default function SendWhatsApp() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMsg}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div style={{ padding: 20 }} className="text-black">
      <h1>Send WhatsApp Message</h1>
      <input
        type="text"
        placeholder="Phone (country code + number)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginBottom: 10, display: "block" }}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: 10, display: "block", width: "100%" }}
      />
      <button onClick={sendMessage}>Send WhatsApp Message</button>
    </div>
  );
}
