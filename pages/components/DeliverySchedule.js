// components/DeliveryList.js

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const DeliveryList = () => {
  const [deliveryData, setDeliveryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disabledOrders, setDisabledOrders] = useState([]);

  const token = Cookies.get("TFLoginToken");
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.216/tf-lara/api/delivery-list",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDeliveryData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryData();
  }, [token]);

  const handleConfirm = async (orderId, userId, menuId, status) => {
    console.log(
      "🚀 ~ handleConfirm ~ orderId, userId, menuId, status:",
      orderId,
      userId,
      menuId,
      status
    );

    try {
      const response = await axios.post(
        "http://192.168.0.216/tf-lara/api/delivery-update", // Replace with your actual API endpoint
        {
          orderId: orderId,
          userId: userId,
          menuId: menuId,
          delivStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle success (e.g., show a message, refresh data)
      console.log("Status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle error (e.g., show an error message)
    }
    setDisabledOrders((prev) => [...prev, orderId]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      {Object.keys(deliveryData).map((date) => (
        <div key={date}>
          <h3 className="h2_akm pad_akm">{date}</h3>
          <h4 className="pad_akm h3_akm">Lunch</h4>
          {deliveryData[date].lunch.length === 0 ? (
            <p>No lunch orders</p>
          ) : (
            deliveryData[date].lunch.map((order) => (
              <div key={order.mrd_order_id} className="pad_akm">
                <p>
                  {order.mrd_user_first_name} - {order.mrd_order_quantity} meals
                </p>
                {order.mrd_user_has_mealbox > 0 && (
                  <div>
                    <div>
                      <p>Has Mealbox: {order.mrd_user_has_mealbox}</p>
                    </div>
                    <p>
                      Picked Mealbox:{" "}
                      <input
                        id="default-checkbox"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      ></input>
                    </p>
                  </div>
                )}

                <label htmlFor={`status-${order.mrd_order_id}`}>Status:</label>
                <select
                  id={`status-${order.mrd_order_id}`}
                  defaultValue={order.mrd_order_status}
                  className="status-dropdown"
                  disabled={
                    ["delivered", "cancelled", "unavailable"].includes(
                      order.mrd_order_status
                    ) || disabledOrders.includes(order.mrd_order_id)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delivered">Delivered</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="delivered_with_due">Delivered with Due</option>
                </select>
                <button
                  onClick={() =>
                    handleConfirm(
                      order.mrd_order_id,
                      order.mrd_user_id,
                      order.mrd_menu_id,
                      document.getElementById(`status-${order.mrd_order_id}`)
                        .value
                    )
                  }
                  className="confirm-button"
                  disabled={
                    ["delivered", "cancelled", "unavailable"].includes(
                      order.mrd_order_status
                    ) || disabledOrders.includes(order.mrd_order_id)
                  }
                >
                  Confirm
                </button>
                <div>
                  {" "}
                  <p>Give Mealbox: {order.mrd_order_mealbox}</p>
                </div>

                <p>Address: {order.mrd_user_address}</p>
                <p>Phone: {order.mrd_user_phone}</p>
              </div>
            ))
          )}
          <h4 className="pad_akm h3_akm">Dinner</h4>
          {deliveryData[date].dinner.length === 0 ? (
            <p>No dinner orders</p>
          ) : (
            deliveryData[date].dinner.map((order) => (
              <div key={order.mrd_order_id}>
                <p>
                  {order.mrd_user_first_name} - {order.mrd_order_quantity} meals
                </p>
                <label htmlFor={`status-${order.mrd_order_id}`}>Status:</label>
                <select
                  id={`status-${order.mrd_order_id}`}
                  defaultValue={order.mrd_order_status}
                  className="status-dropdown"
                  disabled={
                    ["delivered", "cancelled", "unavailable"].includes(
                      order.mrd_order_status
                    ) || disabledOrders.includes(order.mrd_order_id)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delivered">Delivered</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="delivered_with_due">Delivered with Due</option>
                </select>
                <button
                  onClick={() =>
                    handleConfirm(
                      order.mrd_order_id,
                      order.mrd_user_id,
                      order.mrd_menu_id,
                      document.getElementById(`status-${order.mrd_order_id}`)
                        .value
                    )
                  }
                  className="confirm-button"
                  disabled={
                    ["delivered", "cancelled", "unavailable"].includes(
                      order.mrd_order_status
                    ) || disabledOrders.includes(order.mrd_order_id)
                  }
                >
                  Confirm
                </button>

                <p>Address: {order.mrd_user_address}</p>
                <p>Phone: {order.mrd_user_phone}</p>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliveryList;
