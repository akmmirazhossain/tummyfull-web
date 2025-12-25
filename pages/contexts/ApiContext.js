// ApiContext.js
import React, { createContext, useEffect, useState } from "react";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("../../config.json");
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

// // Add PropTypes validation for children
// ApiProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

export { ApiContext, ApiProvider };

// Default export a simple React component
const DefaultComponent = () => <div>ApiContext Placeholder Page</div>;
export default DefaultComponent;
