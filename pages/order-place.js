// pages/order-place.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "./layout/Layout";

const OrderPlace = () => {
  const router = useRouter();
  const { date, menu_id, menu_of } = router.query;
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (menu_id) {
      axios
        .get(`http://192.168.0.216/tf-lara/public/api/menu/${menu_id}`)
        .then((response) => {
          setMenuData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [menu_id]);

  return (
    <Layout title="Order Placement">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order Placement</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Failed to fetch menu data: {error}</p>
        ) : date && menu_id && menu_of && menuData ? (
          <>
            <p>
              Order placed successfully for {menu_of} on {date} with menu ID{" "}
              {menu_id}.
            </p>
            <div className="menu-details mt-4">
              <h2 className="text-xl font-bold mb-2">Menu Details:</h2>
              {menuData.lunch.map((item, index) => (
                <div key={index} className="menu-item mb-2">
                  <img
                    src={item.food_image}
                    alt={item.food_name}
                    className="w-16 h-16 inline-block mr-4"
                  />
                  <span className="text-lg">{item.food_name}</span>
                </div>
              ))}
              <p className="mt-2">Meal Type: {menuData.meal_type}</p>
              <p>Menu ID: {menuData.menu_id_lunch}</p>
              <p>Menu Price: {menuData.menu_price_lunch}</p>
              <p>Menu Day: {menuData.menu_day_lunch}</p>
            </div>
          </>
        ) : (
          <p>Failed to place order. Please try again.</p>
        )}
      </div>
    </Layout>
  );
};

export default OrderPlace;
