// pages/menu2.js

import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import {
  Button,
  Switch,
  Card,
  Chip,
  Spinner,
  Spacer,
  Checkbox,
} from "@nextui-org/react";

const MenuComp = () => {
  const [menuData, setMenuData] = useState(null);
  const [cookies] = useCookies(["TFLoginToken"]);
  const router = useRouter();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch menu data
        const res = await fetch(
          `http://192.168.0.216/tf-lara/public/api/menu2?TFLoginToken=${cookies.TFLoginToken}`
        );
        const data = await res.json();
        setMenuData(data);

        // Fetch settings data
        const settingsRes = await fetch(
          "http://192.168.0.216/tf-lara/public/api/setting"
        );
        const settingsData = await settingsRes.json();
        setSettings(settingsData); // Assuming setSettings is defined elsewhere in your code
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error as needed
      }
    }

    fetchData();
  }, [cookies.TFLoginToken]);
  // Dependency array ensures useEffect runs when TFLoginToken changes

  const checkAndRedirect = () => {
    if (!cookies.TFLoginToken) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    }
  };

  const handleLunchStatusChange = (day) => async () => {
    checkAndRedirect(); // Ensure the user is authenticated

    // Create a copy of the menu data to update the state
    const updatedMenuData = { ...menuData };

    if (updatedMenuData[day].lunch.status === "disabled") {
      updatedMenuData[day].lunch.status = "enabled";
      updatedMenuData[day].lunch.quantity = 1; // Set quantity to 1 when enabling
    } else {
      updatedMenuData[day].lunch.status = "disabled";
      updatedMenuData[day].lunch.quantity = 0; // Reset quantity to 0 when disabling
    }

    setMenuData(updatedMenuData);
  };

  const handleDinnerStatusChange = (day) => async () => {
    checkAndRedirect(); // Ensure the user is authenticated

    // Create a copy of the menu data to update the state
    const updatedMenuData = { ...menuData };

    if (updatedMenuData[day].dinner.status === "disabled") {
      updatedMenuData[day].dinner.status = "enabled";
      updatedMenuData[day].dinner.quantity = 1; // Set quantity to 1 when enabling
    } else {
      updatedMenuData[day].dinner.status = "disabled";
      updatedMenuData[day].dinner.quantity = 0; // Reset quantity to 0 when disabling
    }

    setMenuData(updatedMenuData);
  };

  const handleQuantityChange = (day, mealType, change) => {
    const updatedMenuData = { ...menuData };
    const currentQuantity = updatedMenuData[day][mealType].quantity;

    // Ensure quantity does not go below zero and does not exceed 5
    const newQuantity = Math.max(1, Math.min(5, currentQuantity + change));

    updatedMenuData[day][mealType].quantity = newQuantity;

    setMenuData(updatedMenuData);

    // Optionally, make an API call to persist the change in quantity
    // Example:
    // fetch(`http://example.com/update-quantity`, {
    //   method: 'POST',
    //   body: JSON.stringify({ day, mealType, quantity: newQuantity }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
  };

  const calculateTotalPrice = (price, quantity) => {
    const totalPrice = price * quantity;

    // Apply 10% discount if quantity is more than 1
    const discountedPrice = quantity > 1 ? totalPrice * 0.9 : totalPrice;

    //return Math.round(discountedPrice); // Round to nearest integer

    return Math.floor(discountedPrice); // Round down to nearest integer
    //return discountedPrice.toFixed(2);
  };

  if (!menuData) {
    return <div>Loading...</div>; // You can show a loading indicator while fetching data
  }

  const days = Object.keys(menuData);

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">Weekly Menu</h1>
      <div className="space-y-8">
        {days.map((day) => (
          <div key={day} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              {menuData[day].date} - {menuData[day].menu_of}
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Lunch */}
              <div>
                <h3 className="text-xl font-medium text-green-600 mb-2">
                  Lunch ({settings?.delivery_time_lunch || "N/A"})
                </h3>
                <div className="space-y-2">
                  {menuData[day].lunch.foods.map((food, index) => (
                    <div key={index} className="flex items-center">
                      <img
                        src={`http://192.168.0.216/tf-lara/public/assets/images/${food.food_image}`}
                        alt={food.food_name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <span>{food.food_name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Price:</span>{" "}
                  {menuData[day].lunch.price} BDT
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Status:</span>
                  {/* //MARK: SwLunch*/}
                  <Switch
                    isSelected={menuData[day].lunch.status === "enabled"}
                    onValueChange={handleLunchStatusChange(day)}
                  >
                    {menuData[day].lunch.status === "enabled"
                      ? "Meal Enabled"
                      : "Enable Meal"}
                  </Switch>

                  {menuData[day].lunch.status === "enabled" && (
                    <div className="mt-2">
                      <span className="font-semibold">Quantity:</span>{" "}
                      {menuData[day].lunch.quantity}
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleQuantityChange(day, "lunch", -1)}
                        >
                          -
                        </button>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleQuantityChange(day, "lunch", 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Total Price:</span>{" "}
                        {calculateTotalPrice(
                          menuData[day].lunch.price,
                          menuData[day].lunch.quantity
                        )}{" "}
                        BDT
                        {menuData[day].lunch.quantity > 1 && (
                          <span className="text-gray-500">
                            {" "}
                            (10% discounted)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dinner */}
              <div>
                <h3 className="text-xl font-medium text-red-600 mb-2">
                  Dinner ({settings?.delivery_time_dinner || "N/A"})
                </h3>
                <div className="space-y-2">
                  {menuData[day].dinner.foods.map((food, index) => (
                    <div key={index} className="flex items-center">
                      <img
                        src={`http://192.168.0.216/tf-lara/public/assets/images/${food.food_image}`}
                        alt={food.food_name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <span>{food.food_name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <span className="font-semibold">Price:</span>{" "}
                  {menuData[day].dinner.price} BDT
                </div>
                <div className="mt-1">
                  <span className="font-semibold">Status:</span>{" "}
                  {/* //MARK: SwDinner*/}
                  <Switch
                    isSelected={menuData[day].dinner.status === "enabled"}
                    onValueChange={handleDinnerStatusChange(day)}
                  >
                    {menuData[day].dinner.status === "enabled"
                      ? "Meal Enabled"
                      : "Enable Meal"}
                  </Switch>
                  {menuData[day].dinner.status === "enabled" && (
                    <div className="mt-2">
                      <span className="font-semibold">Quantity:</span>{" "}
                      {menuData[day].dinner.quantity}
                      <div className="flex items-center space-x-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() =>
                            handleQuantityChange(day, "dinner", -1)
                          }
                        >
                          -
                        </button>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleQuantityChange(day, "dinner", 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold">Total Price:</span>{" "}
                        {calculateTotalPrice(
                          menuData[day].dinner.price,
                          menuData[day].dinner.quantity
                        )}{" "}
                        BDT
                        {menuData[day].dinner.quantity > 1 && (
                          <span className="text-gray-500">
                            {" "}
                            (10% discounted)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuComp;
