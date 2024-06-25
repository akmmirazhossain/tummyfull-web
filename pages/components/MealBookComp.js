// components/MealBook.js

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Grid, Text } from "@nextui-org/react";

const MealBook = () => {
  const [mealData, setMealData] = useState({});

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.0.216/tf-lara/public/api/mealbook"
        );
        setMealData(response.data);
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMealData();
  }, []);

  return (
    <div className="container mx-auto mt-5 p-5">
      <h1 className="text-3xl font-bold mb-5">Meal Book</h1>
      <div gap={2}>
        {Object.entries(mealData).map(([date, meals]) => (
          <div key={date} xs={12} sm={6}>
            <Card variant="bordered">
              <Card>
                <span>{date}</span>
              </Card>
              <Card>
                {Object.entries(meals).map(([mealType, details]) => (
                  <div key={mealType} className="mb-4">
                    <h2 className="text-xl font-semibold">{mealType}</h2>
                    <ul className="list-disc list-inside">
                      {details.food_names.map((food, index) => (
                        <li key={index}>{food}</li>
                      ))}
                    </ul>
                    <p className="mt-2">Total Price: {details.total_price}</p>
                    <p>Quantity: {details.quantity}</p>
                    <p>Status: {details.status}</p>
                    <p>Menu Price: {details.menu_price}</p>
                    <p>Promo Price: {details.menu_price_promo}</p>
                    <p>Discount: {details.discount}</p>
                  </div>
                ))}
              </Card>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealBook;
