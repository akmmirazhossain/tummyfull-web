//NotificationContext.js

import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isShaking, setIsShaking] = useState(false);

  const shakeBell = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500); // Reset shaking after 500ms
  };

  return (
    <NotificationContext.Provider value={{ isShaking, shakeBell }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
const DefaultComponent2 = () => <div>ApiContext Placeholder Page</div>;
export default DefaultComponent2;
