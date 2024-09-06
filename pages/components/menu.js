// pages/menu2.js

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button, Card, Chip, Skeleton } from "@nextui-org/react";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassEnd,
  faShippingFast,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import { formatDate } from "../../lib/formatDate";
import { useNotification } from "../contexts/NotificationContext";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" {...props} />
))(({ theme }) => ({
  width: 120,
  height: 64,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 2,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(56px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#004225",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 56,
    height: 56,
  },
  "& .MuiSwitch-track": {
    borderRadius: 64 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const MenuComp = () => {
  const [config, setConfig] = useState(null);
  const [menuData, setMenuData] = useState(null);
  // const [cookies] = useCookies(["TFLoginToken"]);
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [lunchOrderAcceptText, setLunchOrderAcceptText] = useState(true);
  const [dinnerOrderAcceptText, setDinnerOrderAcceptText] = useState(true);
  const [disabledSwitches, setDisabledSwitches] = useState({});
  const [mealboxStatus, setMealboxStatus] = useState(null);

  const { shakeBell } = useNotification();
  //AUTO REFRESH ON NEXT
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      fetchData();

      console.log("MENU REFRESHED");
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  //FETCH MENU
  const fetchData = async () => {
    if (!config) return;

    const { apiBaseUrl, imageBaseUrl } = config;

    try {
      // Fetch menu data
      const menuRes = await fetch(
        `${apiBaseUrl}menu?TFLoginToken=${Cookies.get("TFLoginToken")}`
      );
      const menuData = await menuRes.json();
      setMenuData(menuData);

      // Fetch settings data
      const settingsRes = await fetch(`${apiBaseUrl}setting`);
      const settingsData = await settingsRes.json();
      setSettings(settingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchData();
  }, [config]);

  useEffect(() => {
    // Fetch config.json on component mount
    const fetchConfig = async () => {
      try {
        const response = await fetch("../../config.json"); // Adjust URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    // Fetch data when Cookies.get("TFLoginToken") changes or config is fetched

    fetchData();
  }, [config, Cookies.get("TFLoginToken")]);
  // Dependency array ensures useEffect runs when TFLoginToken changes

  const checkAndRedirect = () => {
    if (!Cookies.get("TFLoginToken")) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    }
  };

  //MARK: Lunch Status
  const handleLunchStatusChange = async (day, menuId, date, value, price) => {
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
      menuId: menuId,
      date: date,
      TFLoginToken: Cookies.get("TFLoginToken"),
      switchValue: value,
      price: price,
      quantity: 1,
    };

    try {
      shakeBell();
      const response = await fetch(`${config.apiBaseUrl}order-place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }
      const responseData = await response.json();
      console.log("🚀 ~ handleLunchStatusChange ~ responseData:", responseData);

      //CHECK IF MEALBOX STATUS IS 1/0 IN THE USER TABLE
      const mealboxData = {
        TFLoginToken: Cookies.get("TFLoginToken"),
      };
      const mealboxRes = await fetch(`${config.apiBaseUrl}mealbox-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealboxData),
      });

      if (!mealboxRes.ok) {
        throw new Error("Failed to send data to the second API");
      }

      const mealboxResData = await mealboxRes.json();
      setMealboxStatus(mealboxResData);
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

  const handleDinnerStatusChange = async (day, menuId, date, value, price) => {
    checkAndRedirect(); // Ensure the user is authenticated
    //SWITCH STATUS CHANGER
    const updatedMenuData = { ...menuData };
    if (updatedMenuData[day].dinner.status === "disabled") {
      updatedMenuData[day].dinner.status = "enabled";
      updatedMenuData[day].dinner.quantity = 1; // Set quantity to 1 when enabling
      setLunchOrderAcceptText(false);
    } else {
      updatedMenuData[day].dinner.status = "disabled";
      //updatedMenuData[day].dinner.quantity = 0; // Reset quantity to 0 when disabling
      setDinnerOrderAcceptText(true);
    }
    setMenuData(updatedMenuData);
    //SWITCH DISABLER
    const switchKey = `${day}-${menuId}`;
    if (disabledSwitches[switchKey]) return;
    // Disable the specific switch
    setDisabledSwitches((prev) => ({ ...prev, [switchKey]: true }));
    // API CALLER
    const data = {
      menuId: menuId,
      date: date,
      TFLoginToken: Cookies.get("TFLoginToken"),
      switchValue: value,
      price: price,
      quantity: 1,
    };

    try {
      shakeBell();
      const response = await fetch(`${config.apiBaseUrl}order-place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to send data to the API");
      }
      const responseData = await response.json();
      console.log(
        "🚀 ~ handleDinnerStatusChange ~ responseData:",
        responseData
      );

      //CHECK IF MEALBOX STATUS IS 1/0 IN THE USER TABLE
      const mealboxData = {
        TFLoginToken: Cookies.get("TFLoginToken"),
      };
      const mealboxRes = await fetch(`${config.apiBaseUrl}mealbox-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealboxData),
      });

      if (!mealboxRes.ok) {
        throw new Error("Failed to send data to the second API");
      }

      const mealboxResData = await mealboxRes.json();
      setMealboxStatus(mealboxResData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
      // SWITCH ENABLER
      setTimeout(() => {
        setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
      }, 100);
    }
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

    updatedMenuData[day][mealType].quantity = newQuantity;

    setMenuData(updatedMenuData);

    console.log(
      "QuantityChange -> Updated Price:",
      updatedMenuData[day][mealType].price
    );

    //CALL CALCULATOR
    const totalPrice = calculateTotalPrice(
      updatedMenuData[day][mealType].price,
      newQuantity
    );

    console.log("QuantityChange -> calcprice:", totalPrice);

    // API CALLER
    const data = {
      menuId,
      date,
      TFLoginToken: Cookies.get("TFLoginToken"),
      quantityValue: newQuantity,
      totalPrice: totalPrice,
    };

    console.log("QuantityChange -> Quantity Data:", data);

    try {
      const response = await fetch(`${config.apiBaseUrl}quantity-changer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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

  // const dayMap = {
  //   fri: "Friday",
  //   sat: "Saturday",
  //   sun: "Sunday",
  //   mon: "Monday",
  //   tue: "Tuesday",
  //   wed: "Wednesday",
  //   thu: "Thursday",
  // };

  if (!menuData || !settings) {
    return (
      <div>
        <h1 className="h1_akm">
          <Skeleton className="rounded-lg h-8 w-28 "></Skeleton>
        </h1>
        <Card className="h-96 p-6 mb-6">
          <div>
            <Skeleton className="rounded-lg h-8 w-60 "></Skeleton>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 h-full">
            <div>
              <Skeleton className="rounded-lg h-full"></Skeleton>
            </div>
            <div>
              <Skeleton className="rounded-lg h-full"></Skeleton>
            </div>
          </div>
        </Card>

        <Card className="h-96 p-6">
          <div>
            <Skeleton className="rounded-lg h-8 w-60 "></Skeleton>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6 h-full">
            <div>
              <Skeleton className="rounded-lg h-full"></Skeleton>
            </div>
            <div>
              <Skeleton className="rounded-lg h-full"></Skeleton>
            </div>
          </div>
        </Card>
      </div>
    ); // You can show a loading indicator while fetching data
  }

  const days = Object.keys(menuData);
  const firstDay = days[0];

  return (
    <div className="">
      {days.map((day) => (
        <>
          <div className="flex items-center justify-between ">
            <div className="h1_akm ">{menuData[day].menu_of}</div>
            <Chip
              radius="full"
              variant="shadow"
              className="ml-2 px-2 py-4 text-md bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            >
              {day.charAt(0).toUpperCase() + day.slice(1)},{" "}
              {formatDate(menuData[day].date)}
            </Chip>
          </div>
          <div key={day} className="  ">
            <div className="grid grid-cols-2 gap_akm">
              {/* Lunch */}

              {
                menuData[day].lunch && (
                  <div className="card_akm">
                    <div className="flex items-center justify-between pad_akm">
                      <div className="h2_akm pl_akm">
                        <span>Lunch</span>
                      </div>
                      <div className="h4_akm pr_akm">
                        <FontAwesomeIcon icon={faShippingFast} />{" "}
                        {settings?.delivery_time_lunch || "N/A"}
                      </div>
                    </div>
                    <div className="relative grid grid-cols-2 gap-2 p-2 lg:p-12 h-auto border-y-1 ">
                      {menuData[day].lunch.foods.map((food, index) => (
                        <div
                          key={index}
                          className=" flex flex-col justify-center items-center "
                        >
                          <img
                            src={`${config.imageBaseUrl}${food.food_image}`}
                            alt={food.name}
                            className="w-28 lg:w-40  rounded-full "
                          />
                          <span className="h4_akm text-center">
                            {food.food_name}
                          </span>
                        </div>
                      ))}

                      {menuData[day].lunch.status === "enabled" && (
                        <div className="absolute w-full bottom-0 flex justify-center items-center flex-col bg-black bg-opacity-50 text-white pad_akm h4_akm slide-up">
                          <div className=" text-center">
                            You have pre-ordered this Lunch
                          </div>
                          <div className=" text-center flex flex-col">
                            <span> Delivery time:</span>
                            <span>
                              {settings?.delivery_time_lunch || "N/A"} (
                              {day.charAt(0).toUpperCase() + day.slice(1)},{" "}
                              {formatDate(menuData[day].date)})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center h3_akm py_akm">
                      <span className="">৳ {menuData[day].lunch.price}</span>
                    </div>
                    <div className="flex items-center flex-col justify-center -m-2 pb_akm">
                      {/* //MARK: Lunch Sw  */}
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={menuData[day].lunch.status === "enabled"} // Use 'checked' instead of 'defaultChecked'
                        disabled={
                          disabledSwitches[`${day}-${menuData[day].lunch.id}`]
                        }
                        onChange={(event) => {
                          const { checked } = event.target;
                          console.log("Lunch Switch triggered for day:", day);
                          handleLunchStatusChange(
                            day,
                            menuData[day].lunch.id,
                            menuData[day].date,
                            checked, // Pass 'checked' instead of 'value'
                            menuData[day].lunch.price
                          );
                        }}
                      />
                      {menuData[day].lunch.status === "enabled"
                        ? "Meal ordered"
                        : "Tap to order"}
                    </div>
                    <div className=" px_akm pb_akm">
                      {firstDay === day &&
                        lunchOrderAcceptText &&
                        menuData[day].lunch.status !== "enabled" && (
                          <div className=" h4info_akm  px_akm flex justify-center items-center">
                            Accepting this order till{" "}
                            {settings.time_limit_lunch}
                          </div>
                        )}

                      {menuData[day].lunch.status === "enabled" && (
                        <div className="mt-2 flex flex-col pb_akm">
                          {menuData[day].lunch.mealbox !== null ? (
                            <Link href="/settings#mealbox">
                              <div className="h4info_akm flex items-center justify-center py-1">
                                {/* {menuData[day].lunch.mealbox} */}
                                Mealbox
                                {menuData[day]?.lunch?.mealbox === 1 ? (
                                  <span className="text-green-600 ml-1">
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                  </span>
                                ) : (
                                  <span className=" ml-1">
                                    <FontAwesomeIcon
                                      icon={faCircleExclamation}
                                    />
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            mealboxStatus !== null && (
                              <Link href="/settings#mealbox">
                                <div className="h4info_akm flex items-center justify-center py-1">
                                  Mealbox
                                  {mealboxStatus === 1 ? (
                                    <span className="text-green-600 ml-1">
                                      <FontAwesomeIcon icon={faCircleCheck} />
                                    </span>
                                  ) : (
                                    <span className=" ml-1">
                                      <FontAwesomeIcon
                                        icon={faCircleExclamation}
                                      />
                                    </span>
                                  )}
                                </div>
                              </Link>
                            )
                          )}

                          <div className="flex items-center justify-center space-x-2">
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

                            <div>{menuData[day].lunch.quantity}</div>
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
                          <div className="mt_akm flex flex-col items-center justify-center">
                            <span className="font-semibold">
                              Total:{" "}
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].lunch.price,
                                  menuData[day].lunch.quantity
                                )
                              }{" "}
                              BDT
                            </span>
                            {menuData[day].lunch.quantity > 1 && (
                              <span className="h4info_akm">
                                {" "}
                                (10% discounted)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
                // : (
                //   <div className="flex items-center justify-center h-full">
                //     <FontAwesomeIcon
                //       icon={faHourglassEnd}
                //       className="text-6xl text-gray-200"
                //     />
                //   </div>
                // )
              }

              {/* Dinner */}

              {
                menuData[day].dinner && (
                  <div className="card_akm">
                    <div className="flex items-center justify-between pad_akm">
                      <div className="h2_akm pl_akm">
                        <span>Dinner</span>
                      </div>
                      <div className="h4_akm pr_akm">
                        <FontAwesomeIcon icon={faShippingFast} />{" "}
                        {settings?.delivery_time_dinner || "N/A"}
                      </div>
                    </div>
                    <div className="relative grid grid-cols-2 gap-2 p-2 lg:p-12 h-auto border-y-1">
                      {menuData[day].dinner.foods.map((food, index) => (
                        <div
                          key={index}
                          className=" flex flex-col justify-center items-center "
                        >
                          <img
                            src={`${config.imageBaseUrl}${food.food_image}`}
                            alt={food.name}
                            className="w-28 lg:w-40  rounded-full "
                          />
                          <span className="h4_akm text-center">
                            {food.food_name}
                          </span>
                        </div>
                      ))}

                      {menuData[day].dinner.status === "enabled" && (
                        <div className="absolute w-full bottom-0 flex justify-center items-center flex-col bg-black bg-opacity-50 text-white pad_akm h4_akm slide-up">
                          <div className=" text-center">
                            You have pre-ordered this Dinner
                          </div>
                          <div className=" text-center flex flex-col">
                            <span> Delivery time:</span>
                            <span>
                              {settings?.delivery_time_dinner || "N/A"} (
                              {day.charAt(0).toUpperCase() + day.slice(1)},{" "}
                              {formatDate(menuData[day].date)})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center h3_akm py_akm">
                      <span className="">৳ {menuData[day].dinner.price}</span>
                    </div>
                    <div className="flex items-center flex-col justify-center -m-2 pb_akm">
                      {/* //MARK: Dinner Sw  */}
                      <IOSSwitch
                        sx={{ m: 1 }}
                        checked={menuData[day].dinner.status === "enabled"} // Use 'checked' instead of 'defaultChecked'
                        disabled={
                          disabledSwitches[`${day}-${menuData[day].dinner.id}`]
                        }
                        onChange={(event) => {
                          const { checked } = event.target;
                          console.log("Dinner Switch triggered for day:", day);
                          handleDinnerStatusChange(
                            day,
                            menuData[day].dinner.id,
                            menuData[day].date,
                            checked, // Pass 'checked' instead of 'value'
                            menuData[day].dinner.price
                          );
                        }}
                      />
                      {menuData[day].dinner.status === "enabled"
                        ? "Meal ordered"
                        : "Tap to order"}
                    </div>
                    <div className=" px_akm pb_akm">
                      {firstDay === day &&
                        dinnerOrderAcceptText &&
                        menuData[day].dinner.status !== "enabled" && (
                          <div className=" h4info_akm  px_akm flex justify-center items-center">
                            Accepting this order till{" "}
                            {settings.time_limit_dinner}
                          </div>
                        )}

                      {menuData[day].dinner.status === "enabled" && (
                        <div className="mt-2 flex flex-col pb_akm">
                          {menuData[day].dinner.mealbox !== null ? (
                            <Link href="/settings#mealbox">
                              <div className="h4info_akm flex items-center justify-center py-1">
                                {/* {menuData[day].dinner.mealbox} */}
                                Mealbox
                                {menuData[day]?.dinner?.mealbox === 1 ? (
                                  <span className="text-green-600 ml-1">
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                  </span>
                                ) : (
                                  <span className=" ml-1">
                                    <FontAwesomeIcon
                                      icon={faCircleExclamation}
                                    />
                                  </span>
                                )}
                              </div>
                            </Link>
                          ) : (
                            mealboxStatus !== null && (
                              <Link href="/settings#mealbox">
                                <div className="h4info_akm flex items-center justify-center py-1">
                                  Mealbox
                                  {mealboxStatus === 1 ? (
                                    <span className="text-green-600 ml-1">
                                      <FontAwesomeIcon icon={faCircleCheck} />
                                    </span>
                                  ) : (
                                    <span className=" ml-1">
                                      <FontAwesomeIcon
                                        icon={faCircleExclamation}
                                      />
                                    </span>
                                  )}
                                </div>
                              </Link>
                            )
                          )}
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              radius="full"
                              isIconOnly
                              isDisabled={
                                disabledSwitches[
                                  `${day}-${menuData[day].dinner.id}-decrement`
                                ]
                              }
                              className="bg-blue-500 text-white"
                              onClick={() =>
                                handleQuantityChange(
                                  day,
                                  "dinner",
                                  -1,
                                  menuData[day].dinner.id,
                                  menuData[day].date
                                )
                              }
                            >
                              -
                            </Button>

                            <div>{menuData[day].dinner.quantity}</div>
                            <Button
                              radius="full"
                              isIconOnly
                              isDisabled={
                                disabledSwitches[
                                  `${day}-${menuData[day].dinner.id}-increment`
                                ]
                              }
                              className="bg-blue-500 text-white"
                              onClick={() =>
                                handleQuantityChange(
                                  day,
                                  "dinner",
                                  1,
                                  menuData[day].dinner.id,
                                  menuData[day].date
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          <div className="mt_akm flex flex-col items-center justify-center">
                            <span className="font-semibold">
                              Total:{" "}
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].dinner.price,
                                  menuData[day].dinner.quantity
                                )
                              }{" "}
                              BDT
                            </span>
                            {menuData[day].dinner.quantity > 1 && (
                              <span className="h4info_akm">
                                {" "}
                                (10% discounted)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
                // : (
                //   <div className="flex items-center justify-center h-full">
                //     <FontAwesomeIcon
                //       icon={faHourglassEnd}
                //       className="text-6xl text-gray-200"
                //     />
                //   </div>
                // )
              }
            </div>
          </div>
        </>
      ))}
      <div className="pad_akm text-center h4info_akm">
        Menu rotates daily for the upcoming 7 days
      </div>
    </div>
  );
};

export default MenuComp;
