// pages/components/menuComp.js
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { formatDate } from "../../lib/formatDate";
import { useNotification } from "../contexts/NotificationContext";
import { useUser } from "../contexts/UserContext";
import FeedbackModal from "./FeedbackModal";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { useSettings } from "../contexts/SettingContext";
import { motion, AnimatePresence } from "framer-motion";
import MealPeriodPopover from "./MealPeriodPopover";
import { useSnackbar } from "./ui/Snackbar";
import FoodSwap from "./meal/FoodSwap";
import MenuSkeleton from "./ui/MenuSkeleton";
import { createLogger } from "../../lib/logger";
import OrderSummery from "./meal/OrderSummery";
import IOSSwitchComponent from "./ui/IOSSwitchComponent";

const MenuComp = ({ refreshMenu, setRefreshMenu }) => {
  const logger = createLogger("MenuComp");
  const [menuData, setMenuData] = useState(null);
  const router = useRouter();
  const [orderAcceptText, setOrderAcceptText] = useState({
    lunch: true,
    dinner: true,
  });
  const { settings, loadingSettings } = useSettings();
  const [disabledMeals, setDisabledMeals] = useState({});
  const { shakeBell, notifLoadTrigger } = useNotification();
  const { user, loadingUser, error, isLoggedIn, refreshUser, loginToken } =
    useUser();
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    orderId: null,
    dateAdded: null,
    message: null,
  });

  const [showMealPeriodPopover, setMealPeriodPopover] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [selectedKitchenId, setSelectedKitchenId] = useState("");
  // const [refreshMenu, setRefreshMenu] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [swappedFoods, setSwappedFoods] = useState(null);
  const [swappedFoodsData, setSwappedFoodsData] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  //KITCHEN BUTTON TRIGGER, REFRESH MENU
  useEffect(() => {
    setSelectedKitchenId(localStorage.getItem("selectedKitchenId"));

    if (refreshMenu && !loadingUser) {
      logger.info("KITCHEN BUTTON TRIGGER, REFRESH MENU");
      fetchMenu(loginToken);
      setRefreshMenu(false);
    }
  }, [refreshMenu]);

  //ON PAGE VISIT, LOAD MENU
  useEffect(() => {
    if (!loadingUser) {
      logger.info("ON PAGE VISIT, LOAD MENU");
      fetchMenu(loginToken);
    }
  }, [loginToken, loadingUser, isLoggedIn]);

  //AUTO REFRESH ON PAGE REVISIT
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        //logger.warn("handleVisibilityChange triggered - page visible");
        //setLoadingMenu(true);
        fetchMenu(loginToken);
        notifLoadTrigger();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loginToken, loadingUser, isLoggedIn]);

  //MARK: FETCH MENU
  const fetchMenu = async (loginToken) => {
    // logger.warn("selectedKitchenId", selectedKitchenId);

    if (!selectedKitchenId) {
      return;
    }

    const payload = {
      loginToken: loginToken,
      selectedKitchenId: selectedKitchenId,
    };

    try {
      // Fetch menu data
      const { data: menu } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/menu`,
        { params: payload } // send as query params
      );

      setMenuData(menu);

      // logger.debug("menu", menu);

      //GET DISABLED MEALS
      const disabledRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/disabled-meals`
      );
      setDisabledMeals(disabledRes.data.disabledMeals);
      setLoadingMenu(false);

      //SHOW FEEDBACK MODAL
      if (loginToken) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/get-last-delivered-order`,
            { TFLoginToken: loginToken }
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

  //MARK: ORDER MEAL
  const orderMeal = async (day, date, value, mealPeriod) => {
    if (!loginToken) {
      showSnackbar("Please login to place an order.", "info");
      router.push("/login?fromHomePage=true");
      return;
    }
    // Check if address is empty
    const hasValidAddress =
      user?.data?.address &&
      typeof user.data.address === "string" &&
      user.data.address.trim().length > 0;

    if (!hasValidAddress && value === true) {
      showSnackbar(
        "The delivery address is required to place an order.",
        "warning"
      );

      router.push({
        pathname: "/settings",
      });
      return;
    }

    //ENFORCE MEALBOX
    if (
      (user?.data?.mrd_user_order_delivered ?? 0) >=
        (settings?.mrd_setting_mealbox_enforce_limit ?? Infinity) &&
      user?.data?.mrd_user_mealbox !== true &&
      value
    ) {
      // console.log("user?.data?.mrd_user_mealbox", user?.data?.mrd_user_mealbox);
      window.location.href = "/settings?mealboxEnforceLimit#mealbox";
      return;
    }

    logger.debug("swappedFoodsData", swappedFoodsData);

    let selectedFoodIds = [];
    //REPLACE CURRENT FOOD ITEMS WITH SWAPPED ONES IN THE ARRAY
    if (swappedFoodsData?.[day]?.[mealPeriod]?.length > 0) {
      selectedFoodIds = swappedFoodsData[day][mealPeriod].map((f) => f.foodId);
    } else {
      const defaultItems = menuData?.[day]?.[mealPeriod]?.foodItems || {};
      selectedFoodIds = Object.values(defaultItems)
        .map((categoryItems) => categoryItems[0]?.foodId || null)
        .filter(Boolean); // remove nulls if category was empty
    }

    logger.debug("selectedFoodIds", selectedFoodIds);

    const data = {
      mealPeriod,
      date,
      loginToken,
      switchValue: value,
      quantity: 1,
      selectedFoodIds,
      selectedKitchenId,
      day,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-place`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to send data to the API");

      const responseData = await response.json();
      if (responseData.success) {
        showSnackbar(responseData.message, responseData.type);
      }
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
      showSnackbar("There was an error placing the order.", "error");
    }

    // Refresh menu or do other post-order actions
    fetchMenu(loginToken, loadingUser, isLoggedIn);
    notifLoadTrigger();
    shakeBell();
  };

  //MARK: FOODSWAP FETCH
  const handleFoodSwapUpdate = (data) => {
    // logger.api("data", data.fullFoodList);
    // logger.data("menuData", menuData);

    setSwappedFoodsData((prev) => ({
      ...prev,
      [data.day]: {
        ...(prev[data.day] || {}),
        [data.mealPeriod]: data.swappedFoods,
      },
    }));

    setMenuData((prev) => {
      const updated = { ...prev };

      data.fullFoodList.forEach((catObj) => {
        const { category, foodItems } = catObj;

        updated[data.day] = {
          ...updated[data.day],
          [data.mealPeriod]: {
            ...updated[data.day][data.mealPeriod],
            foodItems: {
              ...updated[data.day][data.mealPeriod].foodItems,
              [category]: foodItems.map((f) => ({
                ...f,
                foodPrice: String(f.foodPrice), // match your original structure
              })),
            },
          },
        };
      });

      return updated;
    });
  };

  //MARK: QTY CNG
  const handleQuantityChange = async (day, date, mealPeriod, value) => {
    //BUTTON DISABLER

    logger.api(day, date, mealPeriod, value);

    //GET CURRENT QTY
    const updatedMenuData = { ...menuData };
    const currentQuantity = updatedMenuData[day][mealPeriod].orderQuantity;

    // SET QUANTITY RANGE
    const newQuantity = Math.max(
      1,
      Math.min(5, parseInt(currentQuantity, 10) + parseInt(value, 10))
    );

    //INJECT IN MENU DATA
    updatedMenuData[day][mealPeriod].orderQuantity = newQuantity;
    setMenuData(updatedMenuData);

    logger.data("updatedMenuData", updatedMenuData);

    // API CALLER
    const data = {
      date,
      day,
      mealPeriod,
      loginToken: loginToken,
      quantity: newQuantity,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quantity-changer`,
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
      console.log("QTY CHANGE:", responseData);
    } catch (error) {
      console.error("Error sending data to the API:", error.message);
    } finally {
    }
    notifLoadTrigger();
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

  // const days = Object.keys(menuData);
  // const firstDay = days[0];

  return (
    <>
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
      {loadingMenu ? (
        <div>
          <MenuSkeleton />
          <MenuSkeleton />
        </div>
      ) : (
        <React.Fragment>
          {(() => {
            const days = Object.keys(menuData);
            const firstDay = days[0];

            return days.map((day, dayIndex) => (
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
                      (mealPeriod) =>
                        menuData[day][mealPeriod] && (
                          <div className="relative card_akm" key={mealPeriod}>
                            {disabledMeals?.[menuData[day].date]?.some(
                              (entry) => entry[mealPeriod] === "yes"
                            ) && (
                              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md rounded_akm">
                                <div
                                  role="alert"
                                  className="alert alert-info bg_green mx_akm text_white"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6 stroke-current shrink-0"
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
                                      (entry) => entry[mealPeriod] === "yes"
                                    )?.message ||
                                      `${
                                        mealPeriod.charAt(0).toUpperCase() +
                                        mealPeriod.slice(1)
                                      } is disabled for this day`}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pad_akm">
                              <div className="flex items-center justify-start">
                                <div className="h2_akm pl_akm ">
                                  {mealPeriod.charAt(0).toUpperCase() +
                                    mealPeriod.slice(1)}
                                </div>
                                <div className="ml-2">
                                  {menuData[day][mealPeriod]
                                    .auto_order_status === 1 && (
                                    <Tooltip
                                      className="text_black"
                                      content={`Auto-ordering every ${
                                        dayMap[day.toLowerCase()]
                                      } ${mealPeriod}`}
                                      showArrow={true}
                                    >
                                      <FontAwesomeIcon
                                        className="h3_akm"
                                        icon={faRepeat}
                                      />
                                    </Tooltip>
                                  )}
                                </div>
                              </div>

                              {/* //MARK: MEAL P SETT */}
                              <Popover placement="bottom">
                                <PopoverTrigger
                                  onClick={() => setMealPeriodPopover(true)}
                                >
                                  <Button
                                    className="text-gray-600 h3_akm hover:text-black"
                                    isIconOnly
                                    variant="light"
                                    radius="full"
                                  >
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                    />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                  {showMealPeriodPopover && (
                                    <MealPeriodPopover
                                      mealDay={dayMap[day.toLowerCase()]}
                                      mealDayShort={day}
                                      mealPeriod={mealPeriod}
                                      quantity={selectedQuantity}
                                      LoginToken={loginToken}
                                      onAutoOrderChange={fetchMenu}
                                      date={menuData[day].date}
                                    />
                                  )}
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="relative grid h-auto grid-cols-2 p-2 lg:p-12 border-y-1">
                              {/* MARK: FOOD SWAP UI */}
                              <FoodSwap
                                loginToken={loginToken}
                                date={menuData[day].date}
                                day={day}
                                mealPeriod={mealPeriod}
                                menuData={menuData}
                                orderIsEnabled={
                                  menuData[day][mealPeriod].orderIsEnabled
                                }
                                onSwapUpdate={handleFoodSwapUpdate}
                                notifLoadTrigger={notifLoadTrigger}
                              />
                              ;
                              {/* {Object.entries(
                          menuData[day][mealPeriod]?.foods || {}
                        ).map(([category, items], index) => {
                          const currentFoodIndex =
                            foodIndexes?.[day]?.[mealPeriod]?.[category] || 0;

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
                              <div className="relative text-center h4_akm">
                                <img
                                  src={`/images/food/${food.food_image}`}
                                  alt={food.food_name}
                                  className={` ${
                                    index ===
                                    Object.keys(
                                      menuData[day][mealPeriod]?.foods || {}
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
                                        mealPeriod,
                                        category,
                                        menuData[day][mealPeriod].status,
                                        menuData[day].date
                                      );
                                    }
                                  }}
                                />
                                <span className="absolute bottom-0 md:bottom-1 text-xs md:text-sm left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-[#004225]/70 text-white px-1.5 py-0.5 rounded-xl">
                                  {food.food_name}
                                </span>

                                <div className="absolute text-xs transform -translate-x-1/2 -translate-y-1/2 top-2/3 left-1/2 text_white">
                                  <AnimatePresence mode="wait">
                                    {swapStatus?.[day]?.[mealPeriod]?.[
                                      category
                                    ] === "updated" && (
                                      <motion.div
                                        key="updated-message"
                                        className="flex gap-1 border-none badge bg-opacity-30"
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
                                    className="absolute top-0 bg-opacity-50 border-none btn bg_green text_white btn-circle btn-xs lg:btn-sm -right-2 hover:bg_green"
                                    onClick={() => {
                                      if (items.length > 1 && !isSwapping) {
                                        foodSwap(
                                          day,
                                          mealPeriod,
                                          category,
                                          menuData[day][mealPeriod].status,
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
                        })} */}
                            </div>

                            <div>
                              {/* //MARK: ORD SUMMERY */}
                              <OrderSummery
                                day={day}
                                mealPeriod={mealPeriod}
                                menuData={menuData}
                                swappedFoodsData={swappedFoodsData}
                              />
                            </div>

                            <div
                              className={`relative flex pad_akm items-center justify-center flex-col ${
                                menuData[day][mealPeriod].orderIsEnabled
                                  ? "bg_green text_white"
                                  : ""
                              }`}
                            >
                              {menuData[day][mealPeriod].orderIsEnabled ? (
                                <div className="bottom-0 flex flex-row items-center justify-center w-full text-base breakup_akm slide-up">
                                  <div>
                                    <div
                                      className={`h3_akm ${
                                        menuData[day][mealPeriod]
                                          .orderOnHoldDue === "yes"
                                          ? "text_orange"
                                          : ""
                                      }`}
                                    >
                                      {menuData[day][mealPeriod]
                                        .orderOnHoldDue === "yes" && (
                                        <FontAwesomeIcon
                                          className="text_orange"
                                          icon={faCircleExclamation}
                                          style={{ marginRight: "6px" }}
                                        />
                                      )}
                                      {mealPeriod.charAt(0).toUpperCase() +
                                        mealPeriod.slice(1)}{" "}
                                      {menuData[day][mealPeriod]
                                        .orderOnHoldDue === "yes"
                                        ? "pre-order on hold"
                                        : "pre-ordered"}
                                    </div>

                                    <div>
                                      {menuData[day][mealPeriod]
                                        .orderOnHoldDue === "yes" && (
                                        <div className="flex flex-col items-start gap-1 pb-2 border-b h4_akm">
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
                                        </div>
                                      )}
                                    </div>

                                    {/* {(() => {
                                      const details = orderDetails(
                                        day,
                                        menuData[day][mealPeriod].id,
                                        menuData[day].date,
                                        menuData[day][mealPeriod].price,
                                        mealPeriod
                                      );
                                      return (
                                        <div className="mt-1 h4_akm">
                                          <div>
                                            Meal price: {details.mealQuantity} x{" "}
                                            {details.singleMealPrice} ={" "}
                                            {details.totalMealPrice}
                                          </div>
                                    
                                          {details.extraBoxes > 0 && (
                                            <div>
                                              Added mealbox:{" "}
                                              {details.extraBoxes} x{" "}
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
                                          <div className="mt-1 mb-1 border-t-1"></div>
                                          <div>
                                            <span> Cash to Give: </span>
                                            <span> ৳{details.cashToGive}</span>
                                          </div>
                                          <div>
                                            <span>
                                              Delivery time:{" "}
                                              {settings?.[
                                                `delivery_time_${mealPeriod}`
                                              ] || "N/A"}
                                              ,{" "}
                                            </span>
                                            <span>
                                              {formatDate(menuData[day].date)}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })()} */}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {/* <div className="flex items-center justify-center py_akm">
                                    {user?.data?.mrd_user_order_delivered > 0 &&
                                    isLoggedIn ? (
                                      <div>
                                        <span className="h3_akm text_green">
                                          ৳
                                        </span>
                                        <span className="h2_akm text_green">
                                          {menuData[day][mealPeriod].price}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <div>
                                          <span className="h3_akm text_green">
                                            ৳
                                          </span>
                                          <span className="h2_akm text_green">
                                            {(
                                              menuData[day][mealPeriod].price *
                                              (1 -
                                                settings.mrd_setting_discount_reg /
                                                  100)
                                            ).toFixed(0)}
                                          </span>
                                        </div>

                                        <div className="line-through h4info_akm">
                                          ৳{menuData[day][mealPeriod].price}
                                        </div>
                                      </div>
                                    )}
                                  </div> */}
                                  {/* <div className="flex items-center justify-center">
                                    <div className="flex flex-col items-center h4_akm">
                                      <span>
                                        Delivery charge: ৳
                                        {
                                          settings.mrd_setting_commission_delivery
                                        }
                                      </span>
                                      <span>
                                        Delivery time:{" "}
                                        {settings?.[
                                          `delivery_time_${mealPeriod}`
                                        ] || "N/A"}
                                      </span>
                                      <span>
                                        {formatDate(menuData[day].date)}
                                      </span>
                                    </div>
                                  </div> */}
                                </>
                              )}
                            </div>

                            {/* //MARK:  SWITCH  */}
                            <div className="flex flex-col items-center justify-center">
                              {/* <IOSSwitchComponent checked={true} /> */}
                              <IOSSwitchComponent
                                sx={{ m: 1 }}
                                checked={
                                  menuData[day][mealPeriod].orderIsEnabled
                                }
                                onChange={(event) => {
                                  const { checked } = event.target;
                                  orderMeal(
                                    day,
                                    menuData[day].date,
                                    checked,
                                    mealPeriod
                                  );
                                }}
                              />
                              {menuData[day][mealPeriod].orderOnholdDue
                                ? `${
                                    mealPeriod.charAt(0).toUpperCase() +
                                    mealPeriod.slice(1)
                                  } On Hold`
                                : menuData[day][mealPeriod].status === "enabled"
                                ? `${
                                    mealPeriod.charAt(0).toUpperCase() +
                                    mealPeriod.slice(1)
                                  } Ordered`
                                : "Tap to Order"}
                            </div>

                            <div className=" px_akm pb_akm">
                              {firstDay === day &&
                                orderAcceptText[mealPeriod] &&
                                menuData[day][mealPeriod].status !==
                                  "enabled" && (
                                  <div className="flex items-center justify-center h4info_akm px_akm">
                                    Accepting this order till{" "}
                                    {mealPeriod === "lunch"
                                      ? settings.time_limit_lunch
                                      : settings.time_limit_dinner}
                                  </div>
                                )}

                              {/* //MARK: QTY UI */}

                              {menuData[day][mealPeriod].orderIsEnabled && (
                                <div className="flex flex-col mt-2 pb_akm">
                                  <div className="flex items-center justify-center space-x-2">
                                    <Button
                                      radius="full"
                                      isIconOnly
                                      isDisabled={false}
                                      className="bg-[#004225]  text-white text-xl"
                                      onClick={() =>
                                        handleQuantityChange(
                                          day,
                                          menuData[day].date,
                                          mealPeriod,
                                          -1
                                        )
                                      }
                                    >
                                      -
                                    </Button>

                                    <div>
                                      {menuData[day][mealPeriod].orderQuantity}
                                    </div>
                                    <Button
                                      radius="full"
                                      isIconOnly
                                      isDisabled={false}
                                      className="bg-[#004225]  text-white text-xl"
                                      onClick={() =>
                                        handleQuantityChange(
                                          day,
                                          menuData[day].date,
                                          mealPeriod,
                                          1
                                        )
                                      }
                                    >
                                      +
                                    </Button>
                                  </div>
                                  <div className="flex flex-col items-center justify-center mt_akm">
                                    {/* {menuData[day][mealPeriod].quantity > 1 && (
                                   
                                    )} */}
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
            ));
          })()}
          <div className="text-center pad_akm h4info_akm">
            Menu rotates daily for the upcoming 7 days
          </div>
        </React.Fragment>
      )}
    </>
  );
};

export default MenuComp;
