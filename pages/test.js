// components/OrderList.js
import { React, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = Cookies.get("TFLoginToken"); // Get the token from cookies
        const response = await axios.get(
          "http://192.168.0.216/tf-lara/api/orderlist-chef-now",
          {
            params: {
              TFLoginToken: token, // Send the token as a query parameter
            },
          }
        );
        setOrders(response.data); // Set the fetched data to the state
      } catch (error) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Total Price</th>
            <th className="py-2 px-4 border-b">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.mrd_order_id}>
              <td className="py-2 px-4 border-b">{order.mrd_order_id}</td>
              <td className="py-2 px-4 border-b">{order.mrd_order_date}</td>
              <td className="py-2 px-4 border-b">{order.mrd_order_status}</td>
              <td className="py-2 px-4 border-b">
                ${order.mrd_order_total_price}
              </td>
              <td className="py-2 px-4 border-b">
                {order.mrd_order_user_pay_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
