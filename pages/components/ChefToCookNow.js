// components/OrderList.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/tf-lara/public/api/orderlist-chef-now"
        );
        setOrderData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return <div className="text-center mt-5 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      {Object.entries(orderData).map(([date, details]) => (
        <div key={date} className="mb-8">
          <div className="flex items-center">
            <h2 className="text-3xl font-bold mb-2">Today to cook </h2>
            <span>({date})</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Lunch</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.lunch.food_id.map((food, index) => (
                  <div key={index} className="border p-4 rounded shadow-md">
                    {/* <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-32 object-cover mb-2"
                    /> */}
                    <h4 className="font-semibold">{food.name}</h4>
                    <p>{food.description}</p>
                    <p className="text-green-500 font-bold">
                      Price: {food.price} BDT
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2">
                Total Quantity: {details.lunch.total_quantity}
              </p>
              <p className="mt-1">
                Menu Price: {details.lunch.mrd_menu_price} BDT
              </p>
              <p className="mt-1">
                Order Total Price: {details.lunch.mrd_order_total_price} BDT
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Dinner</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.dinner.food_id.map((food, index) => (
                  <div key={index} className="border p-4 rounded shadow-md">
                    {/* <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-32 object-cover mb-2"
                    /> */}
                    <h4 className="font-semibold">{food.name}</h4>
                    <p>{food.description}</p>
                    <p className="text-green-500 font-bold">
                      Price: {food.price} BDT
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-2">
                Total Quantity: {details.dinner.total_quantity}
              </p>
              <p className="mt-1">
                Menu Price: {details.dinner.mrd_menu_price} BDT
              </p>
              <p className="mt-1">
                Order Total Price: {details.dinner.mrd_order_total_price} BDT
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center">
        <h2 className="text-3xl font-bold mb-2"> To cook later </h2>
        <span></span>
      </div>
    </div>
  );
};

export default OrderList;
