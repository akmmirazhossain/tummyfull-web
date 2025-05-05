import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiContext } from "./ApiContext";
import Cookies from "js-cookie"; // Import js-cookie to check for cookies

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const apiConfig = useContext(ApiContext); // Consume the ApiConfig

  // Fetch user data from the API
  const fetchUserData = async () => {
    if (!apiConfig) {
      setError("API config is not loaded");
      setLoading(false);
      return;
    }

    const token = Cookies.get("TFLoginToken"); // Check for the TFLoginToken cookie
    if (!token) {
      setError("No login token found");
      setLoading(false);
      return; // Do not proceed if the token is missing
    }

    try {
      const response = await axios.get(`${apiConfig.apiBaseUrl}user-fetch`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });
      setUser(response.data);

      if (response.data != null) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiConfig) {
      fetchUserData(); // Fetch user data if apiConfig is available
    }
  }, [apiConfig]); // Run when apiConfig changes

  const refreshUser = async () => {
    fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, isLoggedIn, refreshUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

const DummyUserContextComponent = () => (
  <div>This is a dummy export for UserContext</div>
);
export default DummyUserContextComponent;
