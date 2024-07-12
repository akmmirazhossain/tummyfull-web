// ApiContext.js
import React, { createContext, useEffect, useState } from "react";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("../../config.json"); // Adjust path as needed
        const data = await response.json();
        setApiConfig(data);
      } catch (error) {
        console.error("Error fetching API config:", error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ApiContext.Provider value={apiConfig}>{children}</ApiContext.Provider>
  );
};

export { ApiContext, ApiProvider };
