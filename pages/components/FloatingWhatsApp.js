import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // Show when the user is within 100px of the bottom
      setIsVisible(fullHeight - (scrollPosition + windowHeight) <= 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.a
      href="https://wa.me/8801748417178?text=Hello"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed z-30 bottom-4 right-2 md:bottom-4 md:right-4 p-1 rounded-full hover:scale-110 transition-transform"
    >
      <img
        src="/images/whatsapp-icon.png"
        alt="WhatsApp"
        className="w-12 h-12"
      />
    </motion.a>
  );
};

export default FloatingWhatsApp;
