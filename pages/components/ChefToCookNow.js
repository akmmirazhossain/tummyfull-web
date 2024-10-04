import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export default function Meals() {
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    if (!apiConfig) return;

    axios
      .get(`${apiConfig.apiBaseUrl}orderlist-chef-now`)
      .then((response) => {
        setMeals(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [apiConfig]);

  function formatDateInBangla(dateString) {
    const date = new Date(dateString);

    const optionsDay = { weekday: "long" };
    const optionsFullDate = { year: "numeric", month: "long", day: "numeric" };

    const day = date.toLocaleDateString("bn-BD", optionsDay);
    const fullDate = date.toLocaleDateString("bn-BD", optionsFullDate);

    return `${day} (${fullDate})`;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto ">
      {Object.keys(meals).length === 0 ? (
        <div className="card_akm pad_akm">No orders for now</div>
      ) : (
        Object.entries(meals).map(([date, mealData]) => (
          <>
            <h2 className="h1_akm card_akm pad_akm mb_akm">
              {formatDateInBangla(date)}
            </h2>
            <div
              key={date}
              className="mb-8 grid grid-cols-1 md:grid-cols-2 gap_akm"
            >
              {Object.entries(mealData)
                .sort(([a], [b]) =>
                  a === "lunch" ? -1 : b === "lunch" ? 1 : 0
                )
                .map(([mealType, mealDetails]) => (
                  <div key={mealType} className="mb-4 card_akm pad_akm">
                    <h3 className="h1_akm capitalize">{mealType}</h3>
                    <div className=" grid grid-cols-2 mb-4 gap_akm">
                      <div className="flex flex-col items-center justify-center gap_akm pad_akm border rounded_akm shadow_akm">
                        <p>
                          <strong>Quantity</strong>
                        </p>
                        <p className="text-5xl">{mealDetails.total_quantity}</p>
                      </div>

                      <div className="flex flex-col items-center justify-center gap_akm pad_akm border rounded_akm shadow_akm">
                        <p>
                          <strong>Box</strong>
                        </p>
                        <p className="text-5xl">{mealDetails.total_mealbox}</p>
                      </div>

                      {/* <p>
                    <strong>Menu ID:</strong> {mealDetails.menu_id}
                  </p> */}
                    </div>
                    <div className="space-y-2">
                      {mealDetails.food_items.map((item) => (
                        <div
                          key={item.mrd_food_id}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={`${apiConfig.imageBaseUrl}${item.mrd_food_img}`}
                            alt={item.mrd_food_name}
                            className="w-16 h-16 object-cover"
                          />
                          <div>
                            <h4 className="text-md font-medium">
                              {item.mrd_food_name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.mrd_food_desc}
                            </p>
                            {/* <p className="text-sm text-gray-800">
                          Price: {item.mrd_food_price}
                        </p> */}
                          </div>
                        </div>
                      ))}
                      <div className="border-t-1 pt_akm">
                        লাঞ্চ রান্নার সময়: সকাল ১০ - ১১:৩০ <br />
                        লাঞ্চ ডেলিভারির সময়: দুপুর ১২ - ৩
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ))
      )}
    </div>
  );
}
