// pages/menu2.js

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { Button, Card, Chip, Skeleton } from "@nextui-org/react";
import { Button as MUIButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleExclamation,
  faCalendarDays,
  faClock,
  faLayerGroup,
  faTruckFast,
  faCoins,
  faCreditCard,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import { formatDate } from "../../lib/formatDate";
import { useNotification } from "../contexts/NotificationContext";
import Cookies from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { ApiContext } from "../contexts/ApiContext";
import LoginForm from "./LoginForm";

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
  const [menuData, setMenuData] = useState(null);
  // const [cookies] = useCookies(["TFLoginToken"]);
  const router = useRouter();
  const [settings, setSettings] = useState(null);
  const [orderAcceptText, setOrderAcceptText] = useState({
    lunch: true,
    dinner: true,
  });

  const [disabledSwitches, setDisabledSwitches] = useState({});
  const [mealboxStatus, setMealboxStatus] = useState(null);
  const apiConfig = useContext(ApiContext);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const [pendingOrder, setPendingOrder] = useState(null);
  const [foodIndexes, setFoodIndexes] = useState(() => {
    const savedIndexes = Cookies.get("selectedFoods");
    return savedIndexes ? JSON.parse(savedIndexes) : {};
  });

  const updateCookie = (updatedIndexes) => {
    Cookies.set("selectedFoods", JSON.stringify(updatedIndexes), {
      expires: 7,
    });
  };

  const formatToDayMonth = (dateString) =>
    dayjs(dateString).format("D[th] MMM");

  const { shakeBell, notifLoadTrigger } = useNotification();
  //AUTO REFRESH ON NEXT
  const handleVisibilityChange = () => {
    console.log("handleVisibilityChange");
    if (document.visibilityState === "visible" && apiConfig) {
      // Add apiConfig check
      fetchData();
      notifLoadTrigger();
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [apiConfig]);

  //FETCH MENU
  const fetchData = async () => {
    console.log("FETCH DATA");
    if (!apiConfig) return;

    try {
      // Fetch menu data
      const { data: menuData } = await axios.get(
        `${apiConfig.apiBaseUrl}menu?TFLoginToken=${Cookies.get(
          "TFLoginToken"
        )}`
      );
      // console.log("FETCH DATA -> TRY:", menuData);
      setMenuData(menuData);

      // Fetch settings data
      const { data: settingsData } = await axios.get(
        `${apiConfig.apiBaseUrl}setting`
      );
      setSettings(settingsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiConfig, Cookies.get("TFLoginToken")]);

  //CLOSE LOGIN MODAL

  // const closeLoginModal = () => {
  //   setLoginModalVisible(false); // Close modal
  //   router.push("/login"); // Redirect to login after modal closes
  // };

  //MARK: FOOD SWAP

  const foodSwap = (date, mealType, category, currentFoodId) => {
    console.log(
      "🚀 ~ foodSwap ~ date, mealType, category, currentFoodId:",
      date,
      mealType,
      category,
      currentFoodId
    );

    setMenuData((prevMenuData) => {
      const dayKey = Object.keys(prevMenuData).find(
        (key) => prevMenuData[key].date === date
      );
      if (!dayKey) return prevMenuData;

      const foodList = prevMenuData[dayKey][mealType].foods[category];
      if (foodList.length < 2) return prevMenuData; // No swap needed for single-item lists

      // Identify next food item before state updates
      const nextFoodId = foodList[1].food_id;

      console.log("➡ Switched to Food ID:", nextFoodId); // Log next food before updating state

      // Rotate array: move first item to the last position
      const updatedFoods = [...foodList.slice(1), foodList[0]];

      // Retrieve the existing customOrder cookie
      let customOrder = Cookies.get("customOrder");
      customOrder = customOrder ? JSON.parse(customOrder) : {};

      // Ensure the structure exists
      if (!customOrder[date]) {
        customOrder[date] = {};
      }
      if (!customOrder[date][mealType]) {
        customOrder[date][mealType] = { foods: {} };
      }

      // Preserve all previous categories and only update the swapped one
      customOrder[date][mealType].foods = {
        ...customOrder[date][mealType].foods, // Keep existing categories
        [category]: updatedFoods.map((food) => ({
          food_id: food.food_id,
          food_name: food.food_name,
          food_image: food.food_image,
        })),
        // Update swapped category
      };

      // Ensure all foods for all categories are stored in the cookie
      Object.keys(prevMenuData[dayKey][mealType].foods).forEach((cat) => {
        if (!customOrder[date][mealType].foods[cat] || cat !== category) {
          customOrder[date][mealType].foods[cat] = prevMenuData[dayKey][
            mealType
          ].foods[cat].map((food) => ({
            food_id: food.food_id,
            food_name: food.food_name,
            food_image: food.food_image,
          }));
        }
      });

      // Store the updated customOrder in the cookie
      sessionStorage.setItem("customOrder", JSON.stringify(customOrder));

      return {
        ...prevMenuData,
        [dayKey]: {
          ...prevMenuData[dayKey],
          [mealType]: {
            ...prevMenuData[dayKey][mealType],
            foods: {
              ...prevMenuData[dayKey][mealType].foods,
              [category]: updatedFoods,
            },
          },
        },
      };
    });
  };

  const getMenuFromSession = (date, mealType) => {
    const storedMenu = sessionStorage.getItem("customOrder");
    if (storedMenu) {
      const parsedMenu = JSON.parse(storedMenu);
      return parsedMenu[date]?.[mealType]?.foods || null;
    }
    return null;
  };

  const checkLogin = () => {
    // if (!Cookies.get("TFLoginToken")) {
    //   setLoginModalVisible(true); // Open the modal
    //   return false; // Indicate no cookie exists
    // }
    // return true;

    if (!Cookies.get("TFLoginToken")) {
      router.push("/login?fromHomePage=true");
    }
  };

  //MARK: Order Meal
  const orderMeal = async (day, menuId, date, value, price, mealPeriod) => {
    console.log("orderMeal");
    // if (!checkLogin()) {
    //   // Store order details
    //   setPendingOrder({ day, menuId, date, value, price, mealPeriod });
    //   return;
    // }
    //if (!checkLogin()) return;
    checkLogin();

    //SWITCH STATUS CHANGER
    const updatedMenuData = { ...menuData };
    if (updatedMenuData[day][mealPeriod].status === "disabled") {
      updatedMenuData[day][mealPeriod].status = "enabled";
      updatedMenuData[day][mealPeriod].quantity = 1;

      setOrderAcceptText((prev) => ({
        ...prev,
        [mealPeriod]: false,
      }));
    } else {
      updatedMenuData[day][mealPeriod].status = "disabled";

      setOrderAcceptText((prev) => ({
        ...prev,
        [mealPeriod]: true,
      }));
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
      const response = await fetch(`${apiConfig.apiBaseUrl}order-place`, {
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
      console.log("🚀 ~ orderMeal ~ responseData:", responseData);

      //CHECK IF MEALBOX STATUS IS 1/0 IN THE USER TABLE
      const mealboxData = {
        TFLoginToken: Cookies.get("TFLoginToken"),
      };
      const mealboxRes = await fetch(`${apiConfig.apiBaseUrl}mealbox-status`, {
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
    if (
      value === true &&
      Cookies.get("TFLoginToken") !== undefined &&
      menuId === menuData[day][mealPeriod].id
    ) {
      setModalData(data);
      setShowModal(true);
    }
  };

  //MARK: Pending Order
  const orderMealPending = () => {
    if (pendingOrder) {
      const { day, menuId, date, value, price, mealPeriod } = pendingOrder;
      orderMeal(day, menuId, date, value, price, mealPeriod);
      setPendingOrder(null); // Clear pending order after processing
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
      notifLoadTrigger();
      const response = await fetch(`${apiConfig.apiBaseUrl}quantity-changer`, {
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
    //const discountedPrice = quantity > 1 ? totalPrice * 0.9 : totalPrice;

    return Math.floor(totalPrice); // Round down to nearest integer
  };

  const dayMap = {
    sat: "Saturday",
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
  };

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
    <React.Fragment>
      {days.map((day, dayIndex) => (
        <div key={dayIndex}>
          <div className="flex items-center justify-between ">
            <div className="h1_akm ">
              {" "}
              {dayMap[day.toLowerCase()] || day}'s Menu
            </div>
            {/* <div className="h1_akm ">{menuData[day].menu_of}</div> */}
            <Chip
              radius="full"
              variant="shadow"
              className="ml-2 px-2 py-4 text-md bg-gradient-to-tr from-[#004225] to-[#008b4f] text-white shadow-lg"
            >
              {formatDate(menuData[day].date)}
            </Chip>
          </div>
          <div key={day}>
            <div className="grid grid-cols-2 gap_akm">
              {["lunch", "dinner"].map(
                (mealType) =>
                  menuData[day][mealType] && (
                    <div className="card_akm" key={mealType}>
                      <div className="flex items-center justify-between pad_akm">
                        <div className="h2_akm pl_akm">
                          <span>
                            {mealType.charAt(0).toUpperCase() +
                              mealType.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="relative grid grid-cols-2 p-2 lg:p-12 h-auto border-y-1">
                        {(() => {
                          // New variable for fetching data from cookie or API
                          const foodsData =
                            getMenuFromCookie(menuData[day].date, mealType) ||
                            menuData[day][mealType].foods;

                          return Object.keys(foodsData).map(
                            (category, index) => {
                              const food = foodsData[category][0]; // Get first item of the category

                              return (
                                <div
                                  key={index}
                                  className={`flex items-center ${
                                    index === 0
                                      ? "justify-end mr-1 lg:mr-2"
                                      : index === 1
                                      ? "justify-start ml-1 lg:ml-2"
                                      : "justify-center col-span-2"
                                  } `}
                                >
                                  <div className="h4_akm text-center relative">
                                    <img
                                      src={`/images/food/${food.food_image}`}
                                      alt={food.food_name}
                                      className={`${
                                        index ===
                                        Object.keys(foodsData).length - 1
                                          ? "w-28 lg:w-44"
                                          : "w-20 lg:w-32"
                                      } rounded-full`}
                                    />
                                    <span>{food.food_name}</span>

                                    {/* MARK: BTN FSWAP */}
                                    {foodsData[category].length > 1 && (
                                      <button
                                        className="btn btn-circle btn-xs lg:btn-sm absolute top-0 right-0 bg-opacity-50 border-none"
                                        onClick={() =>
                                          foodSwap(
                                            menuData[day].date,
                                            mealType,
                                            category,
                                            food.food_id
                                          )
                                        }
                                      >
                                        <span className="relative inline-block">
                                          <FontAwesomeIcon
                                            icon={faRotate}
                                            className="text_green fa-light"
                                          />
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          );
                        })()}

                        {menuData[day][mealType].status === "enabled" && (
                          <div className="absolute w-full bottom-0 flex justify-center items-center flex-col bg-black bg-opacity-50 text-white pad_akm text-base slide-up">
                            <div className="text-center">
                              You have pre-ordered this {mealType}.
                            </div>
                            <div className="text-center flex flex-col">
                              <span>
                                Total: ৳
                                {calculateTotalPrice(
                                  menuData[day][mealType].price,
                                  menuData[day][mealType].quantity
                                ) + settings.mrd_setting_commission_delivery}
                                (Cash on delivery)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center flex-col py_akm">
                        <div className="flex items-center justify-center gap-2">
                          <div>
                            <span className="h3_akm text_green">৳ </span>
                            <span className="h2_akm text_green">
                              {menuData[day][mealType].price}
                            </span>
                          </div>
                          <div className="h4info_akm line-through">৳125</div>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="h4_akm flex flex-col items-center">
                            <span>
                              Delivery charge: ৳
                              {settings.mrd_setting_commission_delivery}
                            </span>
                            <span>
                              Delivery time:{" "}
                              {settings?.[`delivery_time_${mealType}`] || "N/A"}
                            </span>
                            <span>{formatDate(menuData[day].date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* //MARK:  SWITCH  */}
                      <div className="flex items-center flex-col justify-center">
                        <IOSSwitch
                          sx={{ m: 1 }}
                          checked={menuData[day][mealType].status === "enabled"}
                          disabled={
                            disabledSwitches[
                              `${day}-${menuData[day][mealType].id}`
                            ]
                          }
                          onChange={(event) => {
                            const { checked } = event.target;
                            orderMeal(
                              day,
                              menuData[day][mealType].id,
                              menuData[day].date,
                              checked,
                              menuData[day][mealType].price,
                              mealType
                            );
                          }}
                        />
                        {menuData[day][mealType].status === "enabled"
                          ? "Meal ordered"
                          : "Tap to order"}
                      </div>

                      <div className=" px_akm pb_akm">
                        {firstDay === day &&
                          orderAcceptText[mealType] &&
                          menuData[day][mealType].status !== "enabled" && (
                            <div className="h4info_akm px_akm flex justify-center items-center">
                              Accepting this order till{" "}
                              {mealType === "lunch"
                                ? settings.time_limit_lunch
                                : settings.time_limit_dinner}
                            </div>
                          )}

                        {menuData[day][mealType].status === "enabled" && (
                          <div className="mt-2 flex flex-col pb_akm">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                radius="full"
                                isIconOnly
                                isDisabled={
                                  disabledSwitches[
                                    `${day}-${menuData[day][mealType].id}-decrement`
                                  ]
                                }
                                className="bg-[#004225]  text-white text-xl"
                                onClick={() =>
                                  handleQuantityChange(
                                    day,
                                    mealType,
                                    -1,
                                    menuData[day][mealType].id,
                                    menuData[day].date
                                  )
                                }
                              >
                                -
                              </Button>

                              <div>{menuData[day][mealType].quantity}</div>
                              <Button
                                radius="full"
                                isIconOnly
                                isDisabled={
                                  disabledSwitches[
                                    `${day}-${menuData[day][mealType].id}-increment`
                                  ]
                                }
                                className="bg-[#004225]  text-white text-xl"
                                onClick={() =>
                                  handleQuantityChange(
                                    day,
                                    mealType,
                                    1,
                                    menuData[day][mealType].id,
                                    menuData[day].date
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                            <div className="mt_akm flex flex-col items-center justify-center">
                              <span className="font-semibold">
                                Total: ৳
                                {
                                  //MARK: Total Price
                                  calculateTotalPrice(
                                    menuData[day][mealType].price,
                                    menuData[day][mealType].quantity
                                  ) + settings.mrd_setting_commission_delivery
                                }{" "}
                                BDT
                              </span>
                              {menuData[day][mealType].quantity > 1 && (
                                <>
                                  {/* {" "}
                                <span className="h4info_akm">
                                  {" "}
                                  (10% discounted)
                                </span> */}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {showModal &&
                        modalData?.menuId === menuData[day][mealType].id && (
                          <div
                            className="modal modal-open"
                            onClick={() => setShowModal(false)}
                          >
                            <div
                              className="modal-box bg_beige"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <h3 className="font-bold text-lg pb_akm">
                                Your {mealType} order has been placed.
                              </h3>

                              <ul className="list-none space-y-1">
                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                  </span>
                                  <span className="w-36">Date: </span>
                                  <span>{formatDate(modalData?.date)}</span>
                                </li>

                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faClock} />
                                  </span>
                                  <span className="w-36">Delivery Time: </span>
                                  <span>
                                    {mealType === "lunch"
                                      ? settings?.delivery_time_lunch
                                      : settings?.delivery_time_dinner}
                                  </span>
                                </li>

                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                  </span>
                                  <span className="w-36">Quantity: </span>
                                  <span>{modalData?.quantity}</span>
                                </li>

                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faTruckFast} />
                                  </span>
                                  <span className="w-36">
                                    Delivery Charge:{" "}
                                  </span>
                                  <span>
                                    ৳{settings.mrd_setting_commission_delivery}
                                  </span>
                                </li>

                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faCoins} />
                                  </span>
                                  <span className="w-36">Total Price: </span>
                                  <span>
                                    {modalData?.price} +{" "}
                                    {settings.mrd_setting_commission_delivery} ={" "}
                                    <span className="font-bold">
                                      {modalData?.price +
                                        settings.mrd_setting_commission_delivery}
                                    </span>
                                  </span>
                                </li>

                                <li className="flex items-center">
                                  <span className="w-6 mr-1 flex items-center justify-start">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                  </span>
                                  <span className="w-36">Pay. Method: </span>
                                  <span className="flex flex-col md:flex-row gap-1">
                                    Cash on delivery or
                                    <Link
                                      href={"/wallet"}
                                      target="_blank"
                                      className="btn btn-xs rounded_akm bg_green text-white font-normal"
                                    >
                                      Recharge wallet
                                    </Link>
                                  </span>
                                </li>
                              </ul>

                              <div className="modal-action flex justify-center">
                                <button
                                  className="btn bg_green text-white font-normal rounded_akm hover:bg_orange hover:text-inherit"
                                  onClick={() => {
                                    setShowModal(false);
                                  }}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      ))}
      <div className="pad_akm text-center h4info_akm">
        Menu rotates daily for the upcoming 7 days
      </div>

      {/* MARK: Login Modal */}
    </React.Fragment>
  );
};

export default MenuComp;
