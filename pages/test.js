// TriggerBellShake.js
import React, { useRef } from "react";
import NotificationBell from "./components/NotificationBell";

const TriggerBellShake = () => {
  const handleButtonClickRef = useRef(null); // Create a ref to pass

  const triggerNotificationShake = () => {
    if (handleButtonClickRef.current) {
      handleButtonClickRef.current(); // Call the function when needed
    }
  };

  return (
    <div className="text-black">
      {/* Render the NotificationBell component with a ref prop */}
      <NotificationBell onButtonClick={handleButtonClickRef} />
      {/* A button to trigger the bell shake from this component */}
      <button onClick={triggerNotificationShake}>
        Shake Notification Bell
      </button>
      awdwad
    </div>
  );
};

export default TriggerBellShake;
