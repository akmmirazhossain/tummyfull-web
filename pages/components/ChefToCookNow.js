import axios from "axios";
import { useEffect, useState } from "react";

export default function Meals() {
  const [meals, setMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/tf-lara/public/api/orderlist-chef-now")
      .then((response) => {
        setMeals(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
      {Object.entries(meals).map(([date, mealData]) => (
        <>
          <h2 className="h1_akm card_akm pad_akm mb_akm">
            {formatDateInBangla(date)}
          </h2>
          <div
            key={date}
            className="mb-8 grid grid-cols-1 md:grid-cols-2 gap_akm"
          >
            {Object.entries(mealData).map(([mealType, mealDetails]) => (
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
                        src={`http://192.168.0.216/tf-lara/public/assets/images/${item.mrd_food_img}`}
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
                </div>
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
