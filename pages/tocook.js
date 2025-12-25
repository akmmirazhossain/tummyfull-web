// pages/wallet.js
import React, { useContext } from "react";
import Layout from "./layout/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiContext } from "./contexts/ApiContext";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();
  const [foodSummary, setFoodSummary] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [mealPeriod, setMealPeriod] = useState("");
  const [orders, setOrders] = useState([]);
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!apiConfig) return;
      try {
        const response = await axios.get(
          `${apiConfig.apiBaseUrl}orderlist-chef-now`
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
  }, [apiConfig]);

  if (!isAuthenticated) {
    return (
      <Layout>
        {/* <span className="loading loading-ring loading-md"></span> */}
      </Layout>
    );
  }

  return (
    <>
      <Layout title="To Cook">
        <div className="w-full h-full text-white bg-black px_akm">
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

          <div className="pt-4 mt-6 border-t border-gray-500">
            <h2 className="text-lg font-bold">Order Details by Customer</h2>
            {orders.map((order) => (
              <div
                key={order.mrd_order_id}
                id={`print-${order.mrd_order_id}`}
                className="p-2 mt-2 border-b border-gray-700"
              >
                <div className="printable-content">
                  <p className="font-semibold">
                    Name: {order.mrd_user_full_name}
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

                  <div className="flex flex-row gap_akm">
                    <div>
                      মিলবক্স সহ:{" "}
                      <Chip size="lg" color="warning">
                        {order.mrd_order_mealbox}
                      </Chip>
                    </div>
                    <div>
                      ওয়ান টাইম বক্স:{" "}
                      <Chip size="lg" color="default">
                        {order.mrd_order_mealbox_give === 0 ||
                        order.mrd_order_mealbox_give === null ? (
                          order.mrd_order_quantity
                        ) : (
                          <>0</>
                        )}
                      </Chip>
                    </div>
                  </div>
                </div>

                {/* Print Button (Excluded from Print) */}
                <button
                  className="px-3 py-1 mt-2 text-white bg-blue-500 rounded no-print"
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
    </>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <ProtectedPage />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
