// pages/index.js
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "./contexts/ApiContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./layout/Layout";
import Deliveries from "./components/DeliverySchedule";

import { Button } from "@nextui-org/react";

import Cookies from "js-cookie";
import axios from "axios";

const DelivPanel = () => {
  const { isAuthenticated } = useAuth();
  const apiConfig = useContext(ApiContext);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showComponent, setShowComponent] = useState("orderList");

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      const token = Cookies.get("TFLoginToken");
      if (!apiConfig) return;
      try {
        const response = await axios.get(`${apiConfig.apiBaseUrl}user-fetch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log("🚀 ~ fetchUserData ~ data:", data);

        if (data.data.user_type !== "delivery") {
          setHasAccess(false);
        } else {
          setHasAccess(true); // Clear the message if user type is valid
        }

        setLoading(false);
        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        return null;
      }
    };

    fetchUserData();
  }, [apiConfig, isAuthenticated]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <Layout>
        {hasAccess ? (
          <>
            <div className="h1_akm">Delivery Panel</div>
            <Deliveries />
          </>
        ) : (
          !loading && ( // Ensure the message is only shown after loading completes
            <div className="card_akm pad_akm">
              This section is accessible only to delivery person.
            </div>
          )
        )}
      </Layout>
    </>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <DelivPanel />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
