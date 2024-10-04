// pages/index.js
import React, { useContext, useEffect, useState } from "react";
import Layout from "./layout/Layout";
import OrderList from "./components/ChefToCookNow";
import ChefOrderHistory from "./components/ChefOrderHistory";
import ChefPaymentHistory from "./components/ChefPaymentHistory";
import Cookies from "js-cookie";
import axios from "axios";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ApiContext } from "./contexts/ApiContext";
import { Button } from "@nextui-org/react";

const ChefPanel = () => {
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

        if (data.data.user_type !== "chef") {
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
    <Layout>
      <div className="h1_akm">Chef Panel</div>
      {hasAccess ? (
        <>
          <div className="flex gap_akm mb_akm">
            <div>
              <Button
                onPress={() => setShowComponent("orderList")}
                variant="shadow"
                className="bg-white"
                size="lg"
              >
                Order List
              </Button>
            </div>
            <div>
              <Button
                onPress={() => setShowComponent("orderhistory")}
                variant="shadow"
                className="bg-white"
                size="lg"
              >
                Order History
              </Button>
            </div>
            <div>
              <Button
                onPress={() => setShowComponent("paymenthistory")}
                variant="shadow"
                className="bg-white"
                size="lg"
              >
                Payment History
              </Button>
            </div>
          </div>
          {showComponent === "orderList" && <OrderList />}
          {showComponent === "orderhistory" && <ChefOrderHistory />}
          {showComponent === "paymenthistory" && <ChefPaymentHistory />}
        </>
      ) : (
        !loading && ( // Ensure the message is only shown after loading completes
          <div className="card_akm pad_akm">
            This section is accessible only to chefs.
          </div>
        )
      )}
    </Layout>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <ChefPanel />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
