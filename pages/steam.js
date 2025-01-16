import { useEffect, useRef } from "react";
import Smoke from "smoke-effect";

const HomePage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize smoke with lighter gray color
    const smoke = new Smoke(context, [80, 80, 80]);

    // Configure slower smoke particles
    const particleConfig = {
      minVx: -0.02, // Kept same horizontal spread
      maxVx: 0.02, // Kept same horizontal spread
      minVy: -0.1, // Increased upward velocity (from -0.1)
      maxVy: -0.1, // Changed to negative to ensure upward movement (from 0.05)
      minLifetime: 3000, // Slightly reduced to match faster movement
      maxLifetime: 8000, // Slightly reduced to match faster movement
      minScale: 0,
      maxScale: 0.25, // Slightly reduced for more steam-like appearance
    };

    smoke.start();
    smoke.step(50); // Reduced step size (originally 100)

    const addSmoke = () => {
      smoke.addSmoke(400, 500, 6, particleConfig);
      smoke.addSmoke(600, 500, 0.4, particleConfig);

      setTimeout(addSmoke, 1500); // Slightly faster interval for continuous steam
    };

    addSmoke();

    return () => smoke.stop();
  }, []);

  return (
    <div className="bg-black">
      <canvas ref={canvasRef} style={{ display: "block" }} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#FFF",
          textAlign: "center",
        }}
      >
        <h1>Welcome to Dalbhath.com</h1>
      </div>
    </div>
  );
};

export default HomePage;
