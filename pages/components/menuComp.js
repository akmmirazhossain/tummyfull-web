// pages/menu2.js

import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { Button, Card, Chip, Skeleton, Badge } from "@nextui-org/react";
// import { Button as MUIButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleExclamation,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import { formatDate } from "../../lib/formatDate";
import { useNotification } from "../contexts/NotificationContext";
import { useUser } from "../contexts/UserContext";
import FeedbackModal from "./FeedbackModal";
import Cookies from "js-cookie";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { ApiContext } from "../contexts/ApiContext";
import { useSettings } from "../contexts/SettingContext";
import { motion, AnimatePresence } from "framer-motion";
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
  // const [settings, setSettings] = useState(null);
  const [orderAcceptText, setOrderAcceptText] = useState({
    lunch: true,
    dinner: true,
  });

  const [disabledSwitches, setDisabledSwitches] = useState({});
  // const [mealboxStatus, setMealboxStatus] = useState(null);
  const apiConfig = useContext(ApiContext);
  const { settings, loadingSettings } = useSettings();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [disabledMeals, setDisabledMeals] = useState({});

  const { shakeBell, notifLoadTrigger } = useNotification();
  const { user, loading, error, isLoggedIn, refreshUser } = useUser();
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    orderId: null,
    dateAdded: null,
    message: null,
  });
  const LoginToken = Cookies.get("TFLoginToken");

  //AUTO REFRESH ON NEXT

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && apiConfig) {
      // Add apiConfig check
      fetchMenu();
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

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible" && apiConfig) {
  //       fetchMenu();
  //       notifLoadTrigger();
  //       refreshUser();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () =>
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  // }, [apiConfig, user]);

  //MARK: FETCH MENU
  const fetchMenu = async () => {
    if (!apiConfig) {
      console.log("Waiting for dependencies...");
      return;
    }

    try {
      // Fetch menu data
      const { data: menu } = await axios.get(
        `${apiConfig.apiBaseUrl}menu?TFLoginToken=${LoginToken}`
      );
      setMenuData(menu);
      setFoodIndexes(0);

      //GET DISABLED MEALS
      const disabledRes = await axios.get(
        `${apiConfig.apiBaseUrl}disabled-meals`
      );
      setDisabledMeals(disabledRes.data.disabledMeals);

      //SHOW FEEDBACK MODAL
      if (LoginToken) {
        try {
          const { data } = await axios.post(
            `${apiConfig.apiBaseUrl}get-last-delivered-order`,
            { TFLoginToken: LoginToken }
          );

          //SKIP FEEDBACK IF CANCEL IS CLICKED
          const skippedOrderId = localStorage.getItem("skippedFeedbackOrderId");

          if (
            data?.orderId &&
            String(data.orderId) !== String(skippedOrderId)
          ) {
            setFeedbackModal({
              isOpen: true,
              orderId: data.orderId,
              dateAdded: data.dateAdded,
              menuPeriod: data.menuPeriod,
              message: `${
                data.menuPeriod.charAt(0).toUpperCase() +
                data.menuPeriod.slice(1)
              } of ${formatDate(data.dateAdded)}`,
            });
          }
        } catch (error) {
          console.error("Could not fetch feedback-pending order", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [apiConfig]);

  //MARK: FOOD SWAP
  const [foodIndexes, setFoodIndexes] = useState({});
  const [selectedFoods, setSelectedFoods] = useState({});
  const [isSwapping, setIsSwapping] = useState(false);
  const apiTimeoutRef = useRef(null);
  const [swapStatus, setSwapStatus] = useState({});

  const foodSwap = (day, mealType, category, orderStatus, date) => {
    setFoodIndexes((prevIndexes) => {
      const currentIndex = prevIndexes?.[day]?.[mealType]?.[category] || 0;
      const categoryFoods = menuData[day][mealType]?.foods?.[category] || [];

      if (categoryFoods.length <= 1) return prevIndexes; // No swap needed

      const nextIndex = (currentIndex + 1) % categoryFoods.length;
      const currentFoodId = categoryFoods[currentIndex]?.food_id;
      const newFoodId = categoryFoods[nextIndex]?.food_id;

      console.log("🚀 Swapping:", { currentFoodId, newFoodId });

      // Build fresh snapshot of selected foods
      const currentSelectedFoods = {
        ...selectedFoods?.[day]?.[mealType],
        [category]: newFoodId,
      };

      const defaultFoods = Object.entries(
        menuData[day][mealType]?.foods || {}
      ).reduce((acc, [cat, items]) => {
        acc[cat] = items[0]?.food_id;
        return acc;
      }, {});

      const finalFoods = {
        ...defaultFoods,
        ...currentSelectedFoods,
      };

      // Update selectedFoods state
      setSelectedFoods((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: currentSelectedFoods,
        },
      }));

      // Send to backend
      if (LoginToken && orderStatus === "enabled") {
        setIsSwapping(true);

        const updateData = {
          TFLoginToken: LoginToken,
          day,
          mealType,
          category,
          newFoodId,
          currentFoodId,
          finalFoods,
          date,
        };

        // Cancel any previous API call
        if (apiTimeoutRef.current) clearTimeout(apiTimeoutRef.current);

        apiTimeoutRef.current = setTimeout(() => {
          fetch(`${apiConfig.apiBaseUrl}order-food-swap`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("✅ API Response:", data);

              setSwapStatus((prev) => ({
                ...prev,
                [day]: {
                  ...prev[day],
                  [mealType]: {
                    ...prev[day]?.[mealType],
                    [category]: "updated",
                  },
                },
              }));

              setTimeout(() => {
                setSwapStatus((prev) => ({
                  ...prev,
                  [day]: {
                    ...prev[day],
                    [mealType]: {
                      ...prev[day]?.[mealType],
                      [category]: null,
                    },
                  },
                }));
              }, 2000);

              setIsSwapping(false);
            })
            .catch((error) => {
              console.error("❌ Error updating order:", error);
              setIsSwapping(false);
            });

          console.log("🚀 ORDER UPDATE DATA SENT:", updateData);
        }, 1000);
      }

      // Update indexes
      return {
        ...prevIndexes,
        [day]: {
          ...prevIndexes[day],
          [mealType]: {
            ...prevIndexes[day]?.[mealType],
            [category]: nextIndex,
          },
        },
      };
    });
  };

  const checkLogin = () => {
    if (!LoginToken) {
      router.push("/login?fromHomePage=true");
    }
    return;
  };

  //MARK: ORDER MEAL
  const orderMeal = async (day, menuId, date, value, price, mealPeriod) => {
    checkLogin();

    // Check if address is empty

    const hasValidAddress =
      user?.data?.address &&
      typeof user.data.address === "string" &&
      user.data.address.trim().length > 0;

    if (!hasValidAddress && value === true) {
      router.push({
        pathname: "/settings",
        query: {
          no_address: "Please enter your delivery address to place orders",
        },
      });
      return;
    }

    //CHECK DUE FLAG
    const checkDueFlag = user?.data?.mrd_user_status;
    const userCredit = Number(user?.data?.mrd_user_credit) || 0;

    if (checkDueFlag === "flagged_due" && value === true) {
      if (userCredit < 130) {
        window.location.href = "/wallet?rechargeWallet";
        return;
      }
    }

    //ENFORCE MEALBOX

    if (
      (user?.data?.mrd_user_order_delivered ?? 0) >=
        (settings?.mrd_setting_mealbox_enforce_limit ?? Infinity) &&
      user?.data?.mrd_user_mealbox !== 1 &&
      value
    ) {
      window.location.href = "/settings?mealboxEnforceLimit#mealbox";
      return;
    }

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

    // Extract default food selections (first item from each category)
    const defaultFoods = Object.entries(
      menuData[day][mealPeriod]?.foods || {}
    ).reduce((acc, [category, items]) => {
      acc[category] = items[0]?.food_id; // Get first food_id from each category
      return acc;
    }, {});

    // Merge with selected swaps (if any)
    const finalFoods = {
      ...defaultFoods,
      ...(selectedFoods?.[day]?.[mealPeriod] || {}),
    };

    // API CALLER

    // Construct API data
    const data = {
      menuId: menuId,
      date: date,
      TFLoginToken: LoginToken,
      switchValue: value,
      price: price,
      quantity: 1,
      selectedFoods: finalFoods, // Send selected food IDs
      orderType:
        Object.keys(selectedFoods?.[day]?.[mealPeriod] || {}).length > 0
          ? "custom"
          : "default",
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
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
      // SWITCH ENABLER
      setTimeout(() => {
        setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
      }, 100);
    }

    //DUE CHECK, REFRESH MENU
    fetchMenu();
  };

  //MARK: ORDER DETAILS

  const orderDetails = (day, menuId, date, price, mealType) => {
    // if (!user.data.mrd_user_mealbox) {
    //   return;
    // }
    // MEAL CALCULATIONS
    const singleMealPrice = menuData[day][mealType].price;
    const mealQuantity = menuData[day][mealType].quantity;
    const totalMealPrice = singleMealPrice * mealQuantity;
    const mealboxPrice = settings.mealbox_price;
    const deliveryCharge = settings.mrd_setting_commission_delivery;
    const userCredit = user?.data?.mrd_user_credit;

    // USER DATA
    const userMealboxActive = user?.data?.mrd_user_mealbox;

    let mealboxOptions = false;
    let userHasMealbox = 0;
    let extraBoxes = 0;
    let extraBoxPrice = 0;

    //WALLET PAY logic
    // credit - (meal price + deliv charge) = Wallet pay

    //if
    //500 - (650 + 30)
    //Therefore wallet pay here is -500

    //elseif
    //800 - (650 + 30)
    //Therefore wallet pay here is -680

    //elseif
    //0 - (650 + 30)
    //Therefore wallet pay should be 0 here

    if (userMealboxActive) {
      mealboxOptions = true;
      userHasMealbox = user.data.mrd_user_has_mealbox;
      extraBoxes = Math.max(mealQuantity - userHasMealbox, 0);
      extraBoxPrice = extraBoxes * mealboxPrice;
    }

    const totalPrice = totalMealPrice + extraBoxPrice + deliveryCharge;
    //wallet
    const walletPay = Math.min(
      userCredit,
      totalMealPrice + deliveryCharge + extraBoxPrice
    );
    const cashToGive = Math.max(totalPrice - userCredit, 0);

    return {
      singleMealPrice,
      mealQuantity,
      totalMealPrice,
      extraBoxes,
      extraBoxPrice,
      deliveryCharge,
      totalPrice,
      mealboxPrice,
      walletPay,
      cashToGive,
      userCredit,
    };
  };

  //MARK: CART PREVIEW

  // const cartPreview = (day, menuId, date, price, mealType) => {
  //   // console.log("menuComp.js ->", settings);
  //   // MEAL CALCULATIONS
  //   const singleMealPrice = menuData[day][mealType].price;
  //   const mealQuantity = menuData[day][mealType].quantity;
  //   const totalMealPrice = singleMealPrice * mealQuantity;
  //   const mealboxPrice = settings.mealbox_price;
  //   const deliveryCharge = settings.mrd_setting_commission_delivery;

  //   // USER DATA
  //   const userMealboxActive = user.data.mrd_user_mealbox;

  //   let mealboxOptions = false;
  //   let userHasMealbox = 0;
  //   let extraBoxes = 0;
  //   let extraBoxPrice = 0;

  //   if (userMealboxActive) {
  //     mealboxOptions = true;
  //     userHasMealbox = user.data.mrd_user_has_mealbox;
  //     extraBoxes = Math.max(mealQuantity - userHasMealbox, 0);
  //     extraBoxPrice = extraBoxes * mealboxPrice;
  //   }

  //   const totalPrice = totalMealPrice + extraBoxPrice + deliveryCharge;

  //   // Now all variables are in scope here:
  //   setModalData({
  //     date: date,
  //     menuId: menuId,
  //     mealType,
  //     singleMealPrice,
  //     mealQuantity,
  //     totalMealPrice,
  //     mealboxOptions,
  //     userHasMealbox,
  //     mealboxPrice,
  //     extraBoxes,
  //     extraBoxPrice,
  //     deliveryCharge,
  //     totalPrice,
  //   });

  //   setShowModal(true);
  // };

  // const getTotalPrice = (day, mealType) => {
  //   // console.log("getTotalPrice ->", day);
  //   // MEAL CALCULATIONS
  //   const singleMealPrice = menuData[day][mealType].price;
  //   const mealQuantity = menuData[day][mealType].quantity;
  //   const totalMealPrice = singleMealPrice * mealQuantity;
  //   const mealboxPrice = settings.mealbox_price;
  //   const deliveryCharge = settings.mrd_setting_commission_delivery;

  //   if (!user) {
  //     return;
  //   }
  //   // USER DATA
  //   const userMealboxActive = user.data.mrd_user_mealbox;
  //   let mealboxOptions = false;
  //   let userHasMealbox = 0;
  //   let extraBoxes = 0;
  //   let extraBoxPrice = 0;
  //   if (userMealboxActive) {
  //     mealboxOptions = true;
  //     userHasMealbox = user.data.mrd_user_has_mealbox;
  //     extraBoxes = Math.max(mealQuantity - userHasMealbox, 0);
  //     extraBoxPrice = extraBoxes * mealboxPrice;
  //   }
  //   const totalPrice = totalMealPrice + extraBoxPrice + deliveryCharge;
  //   return totalPrice;
  // };

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

    // console.log(
    //   "QuantityChange -> Updated Price:",
    //   updatedMenuData[day][mealType].price
    // );

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
      TFLoginToken: LoginToken,
      quantityValue: newQuantity,
      totalPrice: totalPrice,
    };

    // console.log("QuantityChange -> Quantity Data:", data);

    try {
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
      // console.log("QTY CHANGE:", responseData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
      // Re-enable the specific switch/button after 200 ms
      setTimeout(() => {
        setDisabledSwitches((prev) => ({ ...prev, [switchKey]: false }));
      }, 10);
    }
    notifLoadTrigger();
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

  //  if (!menuData || !settings) {

  if (!menuData || !settings) {
    return (
      <div>
        <div>
          <div className="h1_akm flex items-center justify-between">
            <Skeleton className="rounded-xl h-8 w-36 lg:h-10 lg:w-64 "></Skeleton>
            <Skeleton className="rounded-xl h-8 w-20  lg:h-10 lg:w-24 "></Skeleton>
          </div>
          <div className=" grid grid-cols-2 gap_akm">
            <Card className="  mb-6">
              <div className=" pad_akm my-2">
                <Skeleton className="rounded-xl h-4 w-16 lg:h-8 lg:w-28 ml-2 lg:ml-3"></Skeleton>
              </div>

              <div className=" flex  items-center justify-center h-60  lg:h-[440px] border-y-1">
                <div>
                  <div className=" flex justify-center gap_akm">
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <Skeleton className="rounded-full h-28 w-28 lg:h-44 lg:w-44 "></Skeleton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap_akm items-center justify-center pad_akm">
                <div className="flex flex-col gap_akm items-center justify-center mb-2">
                  <Skeleton className="rounded-xl h-6 w-16 lg:h-10 lg:w-28 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                </div>
                <div className="flex flex-col gap_akm items-center justify-center">
                  <Skeleton className="rounded-full h-16 w-24 lg:h-20 lg:w-36"></Skeleton>
                  <Skeleton className="rounded-full h-2 w-16 lg:h-4 lg:w-28 "></Skeleton>
                </div>
              </div>
            </Card>

            <Card className="  mb-6">
              <div className=" pad_akm my-2">
                <Skeleton className="rounded-xl h-4 w-16 lg:h-8 lg:w-28 ml-2 lg:ml-3"></Skeleton>
              </div>

              <div className=" flex  items-center justify-center h-60  lg:h-[440px] border-y-1">
                <div>
                  <div className=" flex justify-center gap_akm">
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <Skeleton className="rounded-full h-28 w-28 lg:h-44 lg:w-44 "></Skeleton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap_akm items-center justify-center pad_akm">
                <div className="flex flex-col gap_akm items-center justify-center mb-2">
                  <Skeleton className="rounded-xl h-6 w-16 lg:h-10 lg:w-28 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                </div>
                <div className="flex flex-col gap_akm items-center justify-center">
                  <Skeleton className="rounded-full h-16 w-24 lg:h-20 lg:w-36"></Skeleton>
                  <Skeleton className="rounded-full h-2 w-16 lg:h-4 lg:w-28 "></Skeleton>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <div className="h1_akm flex items-center justify-between">
            <Skeleton className="rounded-xl h-8 w-36 lg:h-10 lg:w-64 "></Skeleton>
            <Skeleton className="rounded-xl h-8 w-20  lg:h-10 lg:w-24 "></Skeleton>
          </div>
          <div className=" grid grid-cols-2 gap_akm">
            <Card className="  mb-6">
              <div className=" pad_akm my-2">
                <Skeleton className="rounded-xl h-4 w-16 lg:h-8 lg:w-28 ml-2 lg:ml-3"></Skeleton>
              </div>

              <div className=" flex  items-center justify-center h-60  lg:h-[440px] border-y-1">
                <div>
                  <div className=" flex justify-center gap_akm">
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <Skeleton className="rounded-full h-28 w-28 lg:h-44 lg:w-44 "></Skeleton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap_akm items-center justify-center pad_akm">
                <div className="flex flex-col gap_akm items-center justify-center mb-2">
                  <Skeleton className="rounded-xl h-6 w-16 lg:h-10 lg:w-28 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                </div>
                <div className="flex flex-col gap_akm items-center justify-center">
                  <Skeleton className="rounded-full h-16 w-24 lg:h-20 lg:w-36"></Skeleton>
                  <Skeleton className="rounded-full h-2 w-16 lg:h-4 lg:w-28 "></Skeleton>
                </div>
              </div>
            </Card>

            <Card className="  mb-6">
              <div className=" pad_akm my-2">
                <Skeleton className="rounded-xl h-4 w-16 lg:h-8 lg:w-28 ml-2 lg:ml-3"></Skeleton>
              </div>

              <div className=" flex  items-center justify-center h-60  lg:h-[440px] border-y-1">
                <div>
                  <div className=" flex justify-center gap_akm">
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                    <div>
                      <Skeleton className="rounded-full w-16 h-16 lg:h-32 lg:w-32 "></Skeleton>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div>
                      <Skeleton className="rounded-full h-28 w-28 lg:h-44 lg:w-44 "></Skeleton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap_akm items-center justify-center pad_akm">
                <div className="flex flex-col gap_akm items-center justify-center mb-2">
                  <Skeleton className="rounded-xl h-6 w-16 lg:h-10 lg:w-28 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                  <Skeleton className="rounded-xl h-2 w-20 lg:h-8 lg:w-36 "></Skeleton>
                </div>
                <div className="flex flex-col gap_akm items-center justify-center">
                  <Skeleton className="rounded-full h-16 w-24 lg:h-20 lg:w-36"></Skeleton>
                  <Skeleton className="rounded-full h-2 w-16 lg:h-4 lg:w-28 "></Skeleton>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
                    <div className="card_akm relative" key={mealType}>
                      {disabledMeals?.[menuData[day].date]?.some(
                        (entry) => entry[mealType] === "yes"
                      ) && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-md z-10 flex items-center justify-center rounded_akm">
                          <div
                            role="alert"
                            className="alert alert-info bg_green mx_akm text_white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="h-6 w-6 shrink-0 stroke-current"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            <span>
                              {" "}
                              {disabledMeals[menuData[day].date].find(
                                (entry) => entry[mealType] === "yes"
                              )?.message ||
                                `${
                                  mealType.charAt(0).toUpperCase() +
                                  mealType.slice(1)
                                } is disabled for this day`}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pad_akm">
                        <div className="h2_akm pl_akm">
                          <span>
                            {mealType.charAt(0).toUpperCase() +
                              mealType.slice(1)}
                          </span>
                        </div>
                        <Button className="w-fit">
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </Button>
                      </div>

                      <div className="relative grid grid-cols-2 p-2 lg:p-12 h-auto border-y-1">
                        {Object.entries(
                          menuData[day][mealType]?.foods || {}
                        ).map(([category, items], index) => {
                          const currentFoodIndex =
                            foodIndexes?.[day]?.[mealType]?.[category] || 0;
                          const food = items[currentFoodIndex]; // Get current item based on index

                          return (
                            <div
                              key={index}
                              className={`flex items-center relative ${
                                index === 0
                                  ? "justify-end mr-1 lg:mr-2"
                                  : index === 1
                                  ? "justify-start ml-1 lg:ml-2"
                                  : "justify-center col-span-2"
                              }`}
                            >
                              <div className="h4_akm text-center relative">
                                <img
                                  src={`/images/food/${food.food_image}`}
                                  alt={food.food_name}
                                  className={` ${
                                    index ===
                                    Object.keys(
                                      menuData[day][mealType]?.foods || {}
                                    ).length -
                                      1
                                      ? "w-28 lg:w-44"
                                      : "w-20 lg:w-32"
                                  } rounded-full ${
                                    items.length > 1
                                      ? "cursor-pointer transition-transform active:scale-90"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (items.length > 1 && !isSwapping) {
                                      foodSwap(
                                        day,
                                        mealType,
                                        category,
                                        menuData[day][mealType].status,
                                        menuData[day].date
                                      );
                                    }
                                  }}
                                />
                                <span className="absolute bottom-0 md:bottom-1 text-xs md:text-sm left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#004225]/70 text-white px-1.5 py-0.5 rounded-xl">
                                  {food.food_name}
                                </span>

                                <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text_white">
                                  <AnimatePresence mode="wait">
                                    {swapStatus?.[day]?.[mealType]?.[
                                      category
                                    ] === "updated" && (
                                      <motion.div
                                        key="updated-message"
                                        className="badge flex gap-1 bg-opacity-30 border-none"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        Updated{" "}
                                        <FontAwesomeIcon
                                          className="text-green-600"
                                          icon={faCheckCircle}
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {items.length > 1 && (
                                  <button
                                    className="btn bg_green text_white btn-circle btn-xs lg:btn-sm absolute top-0 -right-2 bg-opacity-50 border-none hover:bg_green"
                                    onClick={() => {
                                      if (items.length > 1 && !isSwapping) {
                                        foodSwap(
                                          day,
                                          mealType,
                                          category,
                                          menuData[day][mealType].status,
                                          menuData[day].date
                                        );
                                      }
                                    }}
                                  >
                                    {items.length}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div
                        className={`relative flex pad_akm items-center justify-center flex-col ${
                          menuData[day][mealType].status === "enabled"
                            ? "bg_green text_white"
                            : ""
                        }`}
                      >
                        {menuData[day][mealType].status === "enabled" ? (
                          <div className=" w-full bottom-0 flex flex-row  breakup_akm justify-center items-center    text-base slide-up">
                            <div>
                              <div
                                className={`h3_akm ${
                                  menuData[day][mealType].on_hold_due === "yes"
                                    ? "text_orange"
                                    : ""
                                }`}
                              >
                                {menuData[day][mealType].on_hold_due ===
                                  "yes" && (
                                  <FontAwesomeIcon
                                    className="text_orange"
                                    icon={faCircleExclamation}
                                    style={{ marginRight: "6px" }}
                                  />
                                )}
                                {mealType.charAt(0).toUpperCase() +
                                  mealType.slice(1)}{" "}
                                {menuData[day][mealType].on_hold_due === "yes"
                                  ? "pre-order on hold"
                                  : "pre-ordered"}
                              </div>

                              <div>
                                {menuData[day][mealType].on_hold_due ===
                                  "yes" && (
                                  <div className="h4_akm flex flex-col items-start gap-1 border-b pb-2">
                                    <div className="text_orange">
                                      {" "}
                                      Please{" "}
                                      <Link
                                        href={"/wallet"}
                                        className="underline"
                                      >
                                        clear your due
                                      </Link>{" "}
                                      to confirm this order
                                    </div>

                                    {/* <Link
                                      href={"/wallet"}
                                      className="btn btn-xs"
                                    >
                                      Recharge Wallet
                                    </Link> */}
                                  </div>
                                )}
                              </div>

                              {(() => {
                                const details = orderDetails(
                                  day,
                                  menuData[day][mealType].id,
                                  menuData[day].date,
                                  menuData[day][mealType].price,
                                  mealType
                                );
                                return (
                                  <div className="h4_akm mt-1">
                                    <div>
                                      Meal price: {details.mealQuantity} x{" "}
                                      {details.singleMealPrice} ={" "}
                                      {details.totalMealPrice}
                                    </div>
                                    {/* <div>Quantity: {details.mealQuantity}</div> */}
                                    {details.extraBoxes > 0 && (
                                      <div>
                                        Added mealbox: {details.extraBoxes} x{" "}
                                        {details.mealboxPrice} ={" "}
                                        {details.extraBoxPrice}
                                      </div>
                                    )}

                                    <div>
                                      Delivery: {details.deliveryCharge}
                                    </div>
                                    {details.userCredit > 0 && (
                                      <div>
                                        Wallet Pay: -{details.walletPay}
                                      </div>
                                    )}
                                    <div className="border-t-1 mt-1 mb-1"></div>
                                    <div>
                                      <span> Cash to Give: </span>
                                      <span> ৳{details.cashToGive}</span>
                                    </div>
                                    <div>
                                      <span>
                                        Delivery time:{" "}
                                        {settings?.[
                                          `delivery_time_${mealType}`
                                        ] || "N/A"}
                                        ,{" "}
                                      </span>
                                      <span>
                                        {formatDate(menuData[day].date)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-center py_akm">
                              {user?.data?.mrd_user_order_delivered > 0 &&
                              isLoggedIn ? (
                                <div>
                                  <span className="h3_akm text_green">৳</span>
                                  <span className="h2_akm text_green">
                                    {menuData[day][mealType].price}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <div>
                                    <span className="h3_akm text_green">৳</span>
                                    <span className="h2_akm text_green">
                                      {(
                                        menuData[day][mealType].price *
                                        (1 -
                                          settings.mrd_setting_discount_reg /
                                            100)
                                      ).toFixed(0)}
                                    </span>
                                  </div>

                                  <div className="h4info_akm line-through">
                                    <span className="h3_akm text_green">৳</span>
                                    <span className="h2_akm text_green">
                                      {menuData[day][mealType].price}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* <div className="h4info_akm line-through">
                                ৳160
                              </div> */}
                            </div>
                            <div className="flex items-center justify-center">
                              <div className="h4_akm flex flex-col items-center">
                                <span>
                                  Delivery charge: ৳
                                  {settings.mrd_setting_commission_delivery}
                                </span>
                                <span>
                                  Delivery time:{" "}
                                  {settings?.[`delivery_time_${mealType}`] ||
                                    "N/A"}
                                </span>
                                <span>{formatDate(menuData[day].date)}</span>
                              </div>
                            </div>
                          </>
                        )}
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
                        {menuData[day][mealType].on_hold_due === "yes"
                          ? `${
                              mealType.charAt(0).toUpperCase() +
                              mealType.slice(1)
                            } On Hold`
                          : menuData[day][mealType].status === "enabled"
                          ? `${
                              mealType.charAt(0).toUpperCase() +
                              mealType.slice(1)
                            } Ordered`
                          : "Tap to Order"}
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
                              {/* <span className="font-semibold">
                                Total: ৳
                                {
                                  //MARK: Total Price
                                  getTotalPrice(day, mealType)
                                }
                                BDT
                              </span> */}
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
      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        orderId={feedbackModal.orderId}
        dateAdded={feedbackModal.dateAdded}
        message={feedbackModal.message}
        onClose={() =>
          setFeedbackModal({
            isOpen: false,
            orderId: null,
            dateAdded: null,
            message: null,
          })
        }
      />
    </React.Fragment>
  );
};

export default MenuComp;
