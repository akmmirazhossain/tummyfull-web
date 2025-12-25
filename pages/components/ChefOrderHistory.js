// components/OrderList.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { ApiContext } from "../contexts/ApiContext";

const ChefOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!apiConfig) return;
      try {
        const token = Cookies.get("TFLoginToken"); // Get the token from cookies
        const response = await axios.get(
          `${apiConfig.apiBaseUrl}chef-order-history`,
          {
            params: {
              TFLoginToken: token, // Send the token as a query parameter
            },
          }
        );
        setOrders(response.data); // Set the fetched data to the state
      } catch {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiConfig]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Quantity</th>

            {/* <th className="px-4 py-2 border-b">Status</th> */}
            <th className="px-4 py-2 border-b"> Comission</th>
            <th className="px-4 py-2 border-b">Order ID</th>
            <th className="px-4 py-2 border-b">Payment from Dalbhath</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center border-b">
                No orders
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const formattedDate = dayjs(order.mrd_order_date).format(
                "D, MMM, YYYY"
              );
              return (
                <tr key={order.mrd_order_id}>
                  <td className="px-4 py-2 text-center border-b">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {order.mrd_order_quantity} x{" "}
                    {order.mrd_setting_commission_chef}
                  </td>
                  {/* <td className="px-4 py-2 text-center border-b">
                  {order.mrd_order_status}
                </td> */}

                  <td className="px-4 py-2 text-center border-b">
                    <span className="text-xs">৳</span>
                    {order.total_commission}
                  </td>

                  <td className="px-4 py-2 text-center border-b">
                    {order.mrd_order_id}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {order.mrd_order_chef_pay_status === "unpaid" ? (
                      <Chip color="warning">unpaid</Chip>
                    ) : (
                      <Chip color="success">paid</Chip>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChefOrderHistory;
