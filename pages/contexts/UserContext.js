// pages/contexts/UserContext.js

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie to check for cookies

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginToken, setLoginToken] = useState(null);

  // Fetch user data from the API
  const fetchUserData = async () => {
    const loginToken = Cookies.get("TFLoginToken"); // Check for the TFLoginToken cookie

    if (!loginToken) {
      setError("No login token found");
      setLoadingUser(false);
      return; // Do not proceed if the token is missing
    }
    setLoginToken(loginToken);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user-fetch`,
        {
          params: {
            loginToken: loginToken, // send token as query param
          },
        }
      );
      setUser(response.data);
      // console.log("🚀 ~ fetchUserData ~ response.data:", response.data);

      if (response.data != null) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const refreshUser = async () => {
    fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{ user, loadingUser, error, isLoggedIn, refreshUser, loginToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

const DummyUserContextComponent = () => (
  <div>This is a dummy export for UserContext</div>
);
export default DummyUserContextComponent;
