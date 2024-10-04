//NotificationContext.js
import React, { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [notifLoad, setNotifLoad] = useState(false);

  // const [loadNotif, setLoadNotif] = useState(false);

  const shakeBell = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Reset shaking after 500ms
  };

  const notifLoadTrigger = () => {
    setNotifLoad((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        isShaking,
        notifLoad,
        setNotifLoad,
        shakeBell,
        notifLoadTrigger,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Add PropTypes validation for children
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotification = () => useContext(NotificationContext);
const DefaultComponent2 = () => <div>ApiContext Placeholder Page</div>;
export default DefaultComponent2;
