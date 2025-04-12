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
  const [foodSummary, setFoodSummary] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [mealPeriod, setMealPeriod] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost/tf-lara/api/orderlist-chef-now"
        );
        const orders = response.data.orders;

        const summary = {};

        orders.forEach((order) => {
          const quantity = order.mrd_order_quantity;
          const foodItems = order.food_details;

          foodItems.forEach((food) => {
            const foodName = food.mrd_food_name;
            if (summary[foodName]) {
              summary[foodName] += quantity;
            } else {
              summary[foodName] = quantity;
            }
          });
        });

        if (response.data.currentDateTime) {
          const dateObj = new Date(response.data.currentDateTime);
          setCurrentDate(
            dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }

        if (orders.length > 0) {
          setMealPeriod(orders[0].mrd_menu_period);
        }
        setOrders(orders);
        setFoodSummary(summary);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

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
          <Layout title="To Cook">
            <div className="w-full h-full bg-black text-white px_akm">
              <div className="h1_akm">
                {" "}
                To Cook Today <span className="h3_akm">({currentDate})</span>
              </div>
              <div className="h2_akm">For {mealPeriod}</div>

              <ul>
                {Object.entries(foodSummary).map(([foodName, quantity]) => (
                  <li key={foodName}>
                    {foodName}: {quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-gray-500 pt-4">
                <h2 className="text-lg font-bold">Order Details by Customer</h2>
                {orders.map((order) => (
                  <div
                    key={order.mrd_order_id}
                    id={`print-${order.mrd_order_id}`}
                    className="mt-2 p-2 border-b border-gray-700"
                  >
                    <div className="printable-content">
                      <p className="font-semibold">
                        Name: {order.mrd_user_first_name}
                      </p>

                      <p>Phone: {order.mrd_user_phone}</p>
                      <p>Address: {order.mrd_user_address}</p>
                      <p>Quantity: {order.mrd_order_quantity}</p>
                      <p>
                        Foods:{" "}
                        {order.food_details
                          .map((food) => `${food.mrd_food_name}`)
                          .join(", ")}
                      </p>
                      <p>Total Price: {order.mrd_order_total_price}</p>
                      <p>Cash To Get: {order.mrd_order_cash_to_get}</p>
                    </div>

                    {/* Print Button (Excluded from Print) */}
                    <button
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded no-print"
                      onClick={() => {
                        const printContent = document.querySelector(
                          `#print-${order.mrd_order_id} .printable-content`
                        ).innerHTML;
                        const printWindow = window.open("", "_blank");
                        printWindow.document.write(`
                  <html>
                    <head>
                      <title>Print Order</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .no-print { display: none; } /* Ensures print button is hidden */
                      </style>
                    </head>
                    <body>
                      ${printContent}
                      <script>
                        window.onload = function() {
                          window.print();
                          window.onafterprint = function() { window.close(); }
                        };
                      </script>
                    </body>
                  </html>
                `);
                        printWindow.document.close();
                      }}
                    >
                      Print
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Layout>
          {/* <div className="flex gap_akm mb_akm">
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
          {showComponent === "paymenthistory" && <ChefPaymentHistory />} */}
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
