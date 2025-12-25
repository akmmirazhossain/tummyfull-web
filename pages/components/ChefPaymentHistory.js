// components/OrderList.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { ApiContext } from "../contexts/ApiContext";

const ChefPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!apiConfig) return;
      try {
        const token = Cookies.get("TFLoginToken"); // Get the token from cookies
        const response = await axios.get(
          `${apiConfig.apiBaseUrl}chef-payment-history`,
          {
            params: {
              TFLoginToken: token, // Send the token as a query parameter
            },
          }
        );
        setPayments(response.data); // Set the fetched data to the state
      } catch {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [apiConfig]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Total Qty.</th>

            {/* <th className="px-4 py-2 border-b">Status</th> */}
            <th className="px-4 py-2 border-b">Total Comission</th>
            <th className="px-4 py-2 border-b">Order ID</th>
            <th className="px-4 py-2 border-b">Payment from Dalbhath</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-4 py-2 text-center border-b">
                No payments
              </td>
            </tr>
          ) : (
            payments.map((payment) => {
              const formattedDate = dayjs(payment.mrd_payment_date_paid).format(
                "D, MMM, YYYY"
              );
              return (
                <tr key={payment.mrd_payment_id}>
                  <td className="px-4 py-2 text-center border-b">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {payment.mrd_payment_order_quantity}
                  </td>

                  {/* <td className="px-4 py-2 text-center border-b">
                  {order.mrd_order_status}
                </td> */}
                  <td className="px-4 py-2 text-center border-b">
                    <span className="text-xs">৳</span>
                    {payment.mrd_payment_amount}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {payment.mrd_payment_order_id}
                  </td>
                  <td className="px-4 py-2 text-center border-b">
                    {payment.mrd_payment_status === "unpaid" ? (
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

export default ChefPaymentHistory;
