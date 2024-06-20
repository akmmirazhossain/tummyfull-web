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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassEnd } from "@fortawesome/free-solid-svg-icons";

const MenuComp = () => {
  const [menuData, setMenuData] = useState(null);
  const [cookies] = useCookies(["TFLoginToken"]);
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [lunchOrderAcceptText, setLunchOrderAcceptText] = useState(true);
  const [dinnerOrderAcceptText, setDinnerOrderAcceptText] = useState(true);
  const [disabledSwitches, setDisabledSwitches] = useState({});
  const [totalPrices, setTotalPrices] = useState({});

  useEffect(() => {
    //MARK: Fetch API
    async function fetchData() {
      try {
        // Fetch menu data
        const res = await fetch(
          `http://192.168.0.216/tf-lara/public/api/menu?TFLoginToken=${cookies.TFLoginToken}`
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

  //MARK: Lunch Status
  const handleLunchStatusChange = async (day, menuId, date, value) => {
    checkAndRedirect(); // Ensure the user is authenticated

    //SWITCH STATUS CHANGER
    const updatedMenuData = { ...menuData };

    if (updatedMenuData[day].lunch.status === "disabled") {
      updatedMenuData[day].lunch.status = "enabled";
      updatedMenuData[day].lunch.quantity = 1; // Set quantity to 1 when enabling
      setLunchOrderAcceptText(false);
    } else {
      updatedMenuData[day].lunch.status = "disabled";
      //updatedMenuData[day].lunch.quantity = 0; // Reset quantity to 0 when disabling
      setLunchOrderAcceptText(true);
    }
    setMenuData(updatedMenuData);

    //SWITCH DISABLER
    const switchKey = `${day}-${menuId}`;
    if (disabledSwitches[switchKey]) return;
    // Disable the specific switch
    setDisabledSwitches((prev) => ({ ...prev, [switchKey]: true }));

    // API CALLER
    const data = {
      menuId,
      date,
      TFLoginToken: cookies.TFLoginToken,
      switchValue: value,
    };

    console.log("API Data:", data);

    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/order-place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
      // SWITCH ENABLER
      setTimeout(() => {
        setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
      }, 100);
    }
  };

  //MARK: Dinner Status
  // const handleDinnerStatusChange = async (day, menuId, date, value) => {
  //   checkAndRedirect(); // Ensure the user is authenticated

  //   //SWITCH STATUS CHANGER
  //   const updatedMenuData = { ...menuData };

  //   if (updatedMenuData[day].dinner.status === "disabled") {
  //     updatedMenuData[day].dinner.status = "enabled";
  //     updatedMenuData[day].dinner.quantity = 1; // Set quantity to 1 when enabling
  //     setdinnerOrderAcceptText(false);
  //   } else {
  //     updatedMenuData[day].dinner.status = "disabled";
  //     updatedMenuData[day].dinner.quantity = 0; // Reset quantity to 0 when disabling
  //     setdinnerOrderAcceptText(true);
  //   }
  //   setMenuData(updatedMenuData);

  //   //SWITCH DISABLER
  //   const switchKey = `${day}-${menuId}`;
  //   if (disabledSwitches[switchKey]) return; // Check if the specific switch is already disabled
  //   // Disable the specific switch
  //   setDisabledSwitches((prev) => ({ ...prev, [switchKey]: true }));

  //   // Prepare data for API call
  //   const data = {
  //     menuId,
  //     date,
  //     TFLoginToken: cookies.TFLoginToken,
  //     switchValue: value,
  //   };

  //   console.log("API Data:", data);

  //   try {
  //     const response = await fetch(
  //       "http://192.168.0.216/tf-lara/public/api/order-place",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to send data to the API");
  //     }

  //     const responseData = await response.json();
  //     console.log("API Response:", responseData);
  //   } catch (error) {
  //     console.error("Error sending data to the API:", error.message);
  //   } finally {
  //     setTimeout(() => {
  //       // SWITCH ENABLER
  //       setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
  //     }, 200);
  //   }
  // };

  // //MARK: Dinner Status
  const handleDinnerStatusChange = (day) => async () => {
    checkAndRedirect(); // Ensure the user is authenticated

    // Create a copy of the menu data to update the state
    const updatedMenuData = { ...menuData };

    if (updatedMenuData[day].dinner.status === "disabled") {
      updatedMenuData[day].dinner.status = "enabled";
      updatedMenuData[day].dinner.quantity = 1; // Set quantity to 1 when enabling
      setDinnerOrderAcceptText(false);
    } else {
      updatedMenuData[day].dinner.status = "disabled";
      updatedMenuData[day].dinner.quantity = 0; // Reset quantity to 0 when disabling
      setDinnerOrderAcceptText(true);
    }

    setMenuData(updatedMenuData);
  };

  //MARK: Quantity Chng
  const handleQuantityChange = async (day, mealType, change, menuId, date) => {
    //BUTTON DISABLER
    const action = change > 0 ? "increment" : "decrement";
    const switchKey = `${day}-${menuId}-${action}`;
    // Check if the switch/button is disabled
    if (disabledSwitches[switchKey]) return;
    // Disable the specific switch/button
    setDisabledSwitches((prev) => ({ ...prev, [switchKey]: true }));

    const updatedMenuData = { ...menuData };
    const currentQuantity = updatedMenuData[day][mealType].quantity;

    // SET QUANTITY RANGE
    const newQuantity = Math.max(
      1,
      Math.min(5, parseInt(currentQuantity, 10) + parseInt(change, 10))
    );

    // console.log("QuantityChange -> currentQuantity", currentQuantity);
    // console.log("QuantityChange -> change", change);
    // console.log("QuantityChange -> updatedMenuData", updatedMenuData);
    // console.log("QuantityChange -> newQuantity", newQuantity);

    updatedMenuData[day][mealType].quantity = newQuantity;

    setMenuData(updatedMenuData);

    console.log(
      "QuantityChange -> Updated Price:",
      updatedMenuData[day][mealType].price
    );

    //CALL CALCULATOR
    // await calculateTotalPrice(
    //   updatedMenuData[day][mealType].price,
    //   newQuantity,
    //   menuId,
    //   date
    // );

    // API CALLER
    const data = {
      menuId,
      date,
      TFLoginToken: cookies.TFLoginToken,
      quantityValue: newQuantity,
    };

    console.log("QuantityChange -> Quantity Data:", data);

    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/quantity-changer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
      // Re-enable the specific switch/button after 200 ms
      setTimeout(() => {
        setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
      }, 10);
    }
  };

  //MARK: Price Calc
  const calculateTotalPrice = (price, quantity) => {
    const totalPrice = price * quantity;

    // Apply 10% discount if quantity is more than 1
    const discountedPrice = quantity > 1 ? totalPrice * 0.9 : totalPrice;

    return Math.floor(discountedPrice); // Round down to nearest integer
  };

  if (!menuData || !settings) {
    return <div>Loading...</div>; // You can show a loading indicator while fetching data
  }

  const days = Object.keys(menuData);
  const firstDay = days[0];

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
                {menuData[day].lunch ? (
                  <>
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
                      <Switch
                        //MARK: Lunch Switch
                        size="lg"
                        isSelected={menuData[day].lunch.status === "enabled"}
                        onValueChange={(value) => {
                          console.log("Lunch Switch triggered for day:", day);
                          handleLunchStatusChange(
                            day,
                            menuData[day].lunch.id,
                            menuData[day].date,
                            value
                          );
                        }}
                        isDisabled={
                          disabledSwitches[`${day}-${menuData[day].lunch.id}`]
                        }
                      >
                        {menuData[day].lunch.status === "enabled"
                          ? "Meal Enabled"
                          : "Enable Meal"}
                      </Switch>
                      {firstDay === day &&
                        lunchOrderAcceptText &&
                        menuData[day].lunch.status !== "enabled" && (
                          <p className="text-gray-500 text-sm mt-1">
                            Accepting this order till{" "}
                            {settings.time_limit_lunch}
                          </p>
                        )}
                      {menuData[day].lunch.status === "enabled" && (
                        <div className="mt-2">
                          <div className="grid grid-cols-2">
                            <div>
                              <span className="font-semibold">Quantity:</span>{" "}
                              {menuData[day].lunch.quantity}
                              <div className="flex items-center space-x-2">
                                <Button
                                  radius="full"
                                  isIconOnly
                                  isDisabled={
                                    disabledSwitches[
                                      `${day}-${menuData[day].lunch.id}-decrement`
                                    ]
                                  }
                                  className="bg-blue-500 text-white"
                                  onClick={() =>
                                    handleQuantityChange(
                                      day,
                                      "lunch",
                                      -1,
                                      menuData[day].lunch.id,
                                      menuData[day].date
                                    )
                                  }
                                >
                                  -
                                </Button>
                                <Button
                                  radius="full"
                                  isIconOnly
                                  isDisabled={
                                    disabledSwitches[
                                      `${day}-${menuData[day].lunch.id}-increment`
                                    ]
                                  }
                                  className="bg-blue-500 text-white"
                                  onClick={() =>
                                    handleQuantityChange(
                                      day,
                                      "lunch",
                                      1,
                                      menuData[day].lunch.id,
                                      menuData[day].date
                                    )
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Checkbox>Auto order every week</Checkbox>
                            </div>
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
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FontAwesomeIcon
                      icon={faHourglassEnd}
                      className="text-6xl text-gray-200"
                    />
                  </div>
                )}
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
                  <Switch
                    //MARK: Dinner Switch
                    isSelected={menuData[day].dinner.status === "enabled"}
                    onValueChange={handleDinnerStatusChange(day)}
                  >
                    {menuData[day].dinner.status === "enabled"
                      ? "Meal Enabled"
                      : "Enable Meal"}
                  </Switch>
                  {firstDay === day && dinnerOrderAcceptText && (
                    <p className="text-gray-500 text-sm mt-1">
                      Accepting this order till {settings.time_limit_dinner}
                    </p>
                  )}
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
