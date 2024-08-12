// components/MealList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const MealList = () => {
  const [meals, setMeals] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    https: axios
      .get("http://apis.kheyecho.xyz/public/api/orderlist-chef-later")
      .then((response) => {
        setMeals(response.data);
      })
      .catch((error) => {
        setError("Failed to fetch data");
      });
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      {Object.entries(meals).map(([date, mealDetails]) => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-bold mb-2">{date}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(mealDetails).map(([mealType, details]) => (
              <div
                key={mealType}
                className="border p-4 rounded shadow-md bg-white"
              >
                <h3 className="text-lg font-semibold mb-1">{mealType}</h3>
                <p className="mb-1">Foods: {details.food_names.join(", ")}</p>
                <p className="mb-1">Total Quantity: {details.total_quantity}</p>
                <p className="mb-1">Menu Price: {details.menu_price} Taka</p>
                <p className="font-bold">
                  Total Price: {details.total_price} Taka
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealList;
