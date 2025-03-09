import { useEffect, useState } from "react";
import axios from "axios";

const OrderSummary = () => {
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

  return (
    <div className="w-full h-full bg-black text-white">
      <div className="h1_akm"> To Cook Today</div>
      <h2>{currentDate}</h2>
      <h3>Meal Period: {mealPeriod}</h3>
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
            className="mt-2 p-2 border-b border-gray-700"
          >
            <p className="font-semibold">{order.mrd_user_first_name}</p>
            <p>Phone: {order.mrd_user_phone}</p>
            <p>Address: {order.mrd_user_address}</p>
            <p>Quantity: {order.mrd_order_quantity}</p>
            <p>
              Foods:{" "}
              {order.food_details
                .map(
                  (food) =>
                    `${food.mrd_food_name} (${order.mrd_order_quantity})`
                )
                .join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
