// pages/menu2.js

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { Button, Card, Chip, Skeleton } from "@nextui-org/react";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShippingFast,
  faCircleCheck,
  faCircleExclamation,
  faCalendarDays,
  faClock,
  faLayerGroup,
  faTruckFast,
  faCoins,
  faCreditCard,
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
  const [lunchOrderAcceptText, setLunchOrderAcceptText] = useState(true);
  const [dinnerOrderAcceptText, setDinnerOrderAcceptText] = useState(true);
  const [disabledSwitches, setDisabledSwitches] = useState({});
  const [mealboxStatus, setMealboxStatus] = useState(null);
  const apiConfig = useContext(ApiContext);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const formatToDayMonth = (dateString) =>
    dayjs(dateString).format("D[th] MMM");

  const { shakeBell, notifLoadTrigger } = useNotification();
  //AUTO REFRESH ON NEXT
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
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
  }, []);

  //FETCH MENU
  const fetchData = async () => {
    console.log("MENU REFRESHED");
    if (!apiConfig) return;

    try {
      // Fetch menu data
      const { data: menuData } = await axios.get(
        `${apiConfig.apiBaseUrl}menu?TFLoginToken=${Cookies.get(
          "TFLoginToken"
        )}`
      );
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
    // Fetch data when Cookies.get("TFLoginToken") changes or config is fetched
    fetchData();
  }, [apiConfig, Cookies.get("TFLoginToken")]);
  // Dependency array ensures useEffect runs when TFLoginToken changes

  const checkAndRedirect = () => {
    if (!Cookies.get("TFLoginToken")) {
      router.push("/login");
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
      console.log("🚀 ~ handleLunchStatusChange ~ responseData:", responseData);

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
      menuId === menuData[day].lunch.id
    ) {
      setModalData(data);
      setShowModal(true);
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
      console.log(
        "🚀 ~ handleDinnerStatusChange ~ responseData:",
        responseData
      );

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
      menuId === menuData[day].dinner.id
    ) {
      setModalData(data);
      setShowModal(true);
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
    <div className="">
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
                    </div>
                    <div className="relative grid grid-cols-2  p-2 lg:p-12 h-auto border-y-1 ">
                      {menuData[day].lunch.foods.map((food, index) => (
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
                          <div className="h4_akm text-center">
                            <img
                              src={`/images/food/${food.food_image}`}
                              alt={food.food_name}
                              className={`${
                                index === menuData[day].lunch.foods.length - 1
                                  ? "w-28 lg:w-44"
                                  : "w-20 lg:w-32"
                              } rounded-full`}
                            />
                            <span>{food.food_name}</span>
                          </div>
                        </div>
                      ))}

                      {menuData[day].lunch.status === "enabled" && (
                        <div className="absolute w-full bottom-0 flex justify-center items-center flex-col bg-black bg-opacity-50 text-white pad_akm text-base slide-up">
                          <div className=" text-center">
                            You have pre-ordered this lunch.
                          </div>
                          <div className=" text-center flex flex-col">
                            <span>
                              Total: ৳
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].lunch.price,
                                  menuData[day].lunch.quantity
                                ) + settings.mrd_setting_commission_delivery
                              }{" "}
                              (Cash on delivery)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center flex-col py_akm md:gap-0.5">
                      <div className="flex items-center justify-center gap-2">
                        <div>
                          {" "}
                          <span className="h3_akm text_green ">৳ </span>
                          <span className=" h2_akm text_green">
                            {menuData[day].lunch.price}
                          </span>
                        </div>
                        <div className="h4info_akm line-through">৳125</div>
                      </div>
                      <div className=" flex items-center justify-center ">
                        <div className=" h4_akm flex flex-col items-center">
                          <span>
                            Delivery charge: ৳
                            {settings.mrd_setting_commission_delivery}
                          </span>{" "}
                          <span>
                            {" "}
                            Delivery time:{" "}
                            {settings?.delivery_time_lunch || "N/A"},
                          </span>
                          <span>{formatDate(menuData[day].date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center flex-col justify-center ">
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
                          <div className="pb-1">
                            {menuData[day].lunch.mealbox !== null ? (
                              <Link href="/settings#mealbox" cla>
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
                          </div>

                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              radius="full"
                              isIconOnly
                              isDisabled={
                                disabledSwitches[
                                  `${day}-${menuData[day].lunch.id}-decrement`
                                ]
                              }
                              className="bg-[#004225]  text-white text-xl"
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
                              className="bg-[#004225]  text-white text-xl"
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
                              Total: ৳
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].lunch.price,
                                  menuData[day].lunch.quantity
                                ) + settings.mrd_setting_commission_delivery
                              }{" "}
                              BDT
                            </span>
                            {menuData[day].lunch.quantity > 1 && (
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

                    {/* //MARK: Modal Lunch  */}

                    {showModal &&
                      modalData?.menuId === menuData[day].lunch.id && (
                        <div
                          className="modal modal-open "
                          onClick={() => setShowModal(false)}
                        >
                          <div
                            className="modal-box bg_beige "
                            onClick={(e) => e.stopPropagation()}
                          >
                            <h3 className="font-bold text-lg pb_akm">
                              Your lunch order has been placed.
                            </h3>

                            <ul className="list-none space-y-1">
                              <li className="flex items-center ">
                                <span className="w-6 mr-1 flex items-center justify-start">
                                  <FontAwesomeIcon icon={faCalendarDays} />
                                </span>
                                <span className="w-36">Date: </span>
                                <span>{formatDate(modalData?.date)}</span>
                              </li>

                              <li className="flex items-center ">
                                <span className="w-6 mr-1  flex items-center justify-start">
                                  <FontAwesomeIcon icon={faClock} />
                                </span>
                                <span className="w-36">Delivery Time: </span>
                                <span>{settings?.delivery_time_lunch}</span>
                              </li>

                              <li className="flex items-center ">
                                <span className="w-6 mr-1  flex items-center justify-start">
                                  <FontAwesomeIcon icon={faLayerGroup} />
                                </span>
                                <span className="w-36">Quantity: </span>
                                <span>{modalData?.quantity}</span>
                              </li>

                              <li className="flex items-center ">
                                <span className="w-6 mr-1  flex items-center justify-start">
                                  <FontAwesomeIcon icon={faTruckFast} />
                                </span>
                                <span className="w-36">Delivery Charge: </span>
                                <span>
                                  ৳{settings.mrd_setting_commission_delivery}
                                </span>
                              </li>

                              <li className="flex items-center ">
                                <span className="w-6 mr-1  flex items-center justify-start">
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

                              <li className="flex items-center ">
                                <span className="w-6 mr-1  flex items-center justify-start">
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
                    </div>
                    <div className="relative grid grid-cols-2  p-2 lg:p-12 h-auto border-y-1">
                      {menuData[day].dinner.foods.map((food, index) => (
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
                          <div className="h4_akm text-center">
                            <img
                              src={`/images/food/${food.food_image}`}
                              alt={food.food_name}
                              className={`${
                                index === menuData[day].dinner.foods.length - 1
                                  ? "w-28 lg:w-44"
                                  : "w-20 lg:w-32"
                              } rounded-full`}
                            />
                            <span>{food.food_name}</span>
                          </div>
                        </div>
                      ))}

                      {menuData[day].dinner.status === "enabled" && (
                        <div className="absolute w-full bottom-0 flex justify-center items-center flex-col bg-black bg-opacity-50 text-white pad_akm text-base slide-up">
                          <div className=" text-center">
                            You have pre-ordered this Dinner
                          </div>
                          <div className=" text-center flex flex-col">
                            <span>
                              Total: ৳
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].dinner.price,
                                  menuData[day].dinner.quantity
                                ) + settings.mrd_setting_commission_delivery
                              }{" "}
                              (Cash on delivery)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center flex-col py_akm md:gap-0.5">
                      <div className="flex items-center justify-center gap-2">
                        <div>
                          {" "}
                          <span className="h3_akm text_green ">৳ </span>
                          <span className=" h2_akm text_green">
                            {menuData[day].dinner.price}
                          </span>
                        </div>
                        <div className="h4info_akm line-through">৳125</div>
                      </div>
                      <div className=" flex items-center justify-center ">
                        <div className=" h4_akm flex flex-col items-center">
                          <span>
                            Delivery charge: ৳
                            {settings.mrd_setting_commission_delivery}
                          </span>{" "}
                          <span>
                            {" "}
                            Delivery time:{" "}
                            {settings?.delivery_time_dinner || "N/A"},
                          </span>
                          <span>{formatDate(menuData[day].date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center flex-col justify-center ">
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
                          <div className="pb-1">
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
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              radius="full"
                              isIconOnly
                              isDisabled={
                                disabledSwitches[
                                  `${day}-${menuData[day].dinner.id}-decrement`
                                ]
                              }
                              className="bg-[#004225] text-white text-xl"
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
                              className="bg-[#004225] text-white text-xl"
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
                              Total: ৳
                              {
                                //MARK: Total Price
                                calculateTotalPrice(
                                  menuData[day].dinner.price,
                                  menuData[day].dinner.quantity
                                ) + settings.mrd_setting_commission_delivery
                              }{" "}
                            </span>
                            {menuData[day].dinner.quantity > 1 && (
                              <>
                                {/* <span className="h4info_akm">
                                  {" "}
                                  (10% discounted)
                                </span> */}
                              </>
                            )}
                          </div>

                          {/* //MARK: Modal Dinner  */}

                          {showModal &&
                            modalData?.menuId === menuData[day].dinner.id && (
                              <div
                                className="modal modal-open "
                                onClick={() => setShowModal(false)}
                              >
                                <div
                                  className="modal-box bg_beige "
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <h3 className="font-bold text-lg pb_akm">
                                    Your dinner order has been placed.
                                  </h3>

                                  <ul className="list-none space-y-1">
                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1 flex items-center justify-start">
                                        <FontAwesomeIcon
                                          icon={faCalendarDays}
                                        />
                                      </span>
                                      <span className="w-36">Date: </span>
                                      <span>{formatDate(modalData?.date)}</span>
                                    </li>

                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1  flex items-center justify-start">
                                        <FontAwesomeIcon icon={faClock} />
                                      </span>
                                      <span className="w-36">
                                        Delivery Time:{" "}
                                      </span>
                                      <span>
                                        {settings?.delivery_time_dinner}
                                      </span>
                                    </li>

                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1  flex items-center justify-start">
                                        <FontAwesomeIcon icon={faLayerGroup} />
                                      </span>
                                      <span className="w-36">Quantity: </span>
                                      <span>{modalData?.quantity}</span>
                                    </li>

                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1  flex items-center justify-start">
                                        <FontAwesomeIcon icon={faTruckFast} />
                                      </span>
                                      <span className="w-36">
                                        Delivery Charge:{" "}
                                      </span>
                                      <span>
                                        ৳
                                        {
                                          settings.mrd_setting_commission_delivery
                                        }
                                      </span>
                                    </li>

                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1  flex items-center justify-start">
                                        <FontAwesomeIcon icon={faCoins} />
                                      </span>
                                      <span className="w-36">
                                        Total Price:{" "}
                                      </span>
                                      <span>
                                        {modalData?.price} +{" "}
                                        {
                                          settings.mrd_setting_commission_delivery
                                        }{" "}
                                        ={" "}
                                        <span className="font-bold">
                                          {modalData?.price +
                                            settings.mrd_setting_commission_delivery}
                                        </span>
                                      </span>
                                    </li>

                                    <li className="flex items-center ">
                                      <span className="w-6 mr-1  flex items-center justify-start">
                                        <FontAwesomeIcon icon={faCreditCard} />
                                      </span>
                                      <span className="w-36">
                                        Pay. Method:{" "}
                                      </span>
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
        </div>
      ))}
      <div className="pad_akm text-center h4info_akm">
        Menu rotates daily for the upcoming 7 days
      </div>
    </div>
  );
};

export default MenuComp;
