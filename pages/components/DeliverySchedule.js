import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";
import dayjs from "dayjs";
import { Chip } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLocationDot,
  faStickyNote,
  faReceipt,
  faUser,
  faMobileScreenButton,
  faBoxOpen,
  faBowlFood,
  faCoins,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [mealboxPicked, setMealboxPicked] = useState({});
  const [settings, setSettings] = useState(null);
  const apiConfig = useContext(ApiContext);

  const token = Cookies.get("TFLoginToken");

  // Add this new function to fetch order details
  const fetchOrderDetails = async () => {
    if (!apiConfig) return;
    try {
      const response = await axios.get(
        `${apiConfig.apiBaseUrl}orderlist-chef-now`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create a map of order details indexed by order ID
      const orderDetailsMap = {};
      response.data.orders.forEach((order) => {
        orderDetailsMap[order.mrd_order_id] = {
          mrd_order_quantity: order.mrd_order_quantity,
          food_details: order.food_details,
        };
      });
      console.log("🚀 ~ fetchOrderDetails ~ orderDetailsMap:", orderDetailsMap);

      return orderDetailsMap;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return {};
    }
  };

  // Modify your fetchDeliveryList function
  const fetchDeliveryList = async () => {
    if (!apiConfig) return;
    try {
      // Fetch settings data
      const { data: settingsData } = await axios.get(
        `${apiConfig.apiBaseUrl}setting`
      );
      setSettings(settingsData);

      // Fetch order details first
      const orderDetailsMap = await fetchOrderDetails();

      const response = await axios.get(`${apiConfig.apiBaseUrl}delivery-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Enhance delivery data with food details
      Object.keys(data).forEach((date) => {
        ["lunch", "dinner"].forEach((period) => {
          data[date][period].forEach((order) => {
            // Add food details and order quantity from the second API
            if (orderDetailsMap[order.mrd_order_id]) {
              order.food_details =
                orderDetailsMap[order.mrd_order_id].food_details;
              // This is redundant as both APIs have mrd_order_quantity, but ensuring we use the second API's data
              order.mrd_order_quantity =
                orderDetailsMap[order.mrd_order_id].mrd_order_quantity;
            }
          });
        });
      });

      setDeliveries(data);

      console.log("🚀 ~ fetchDeliveryList ~ data:", data);

      // Set default order status and mealbox picked states
      const status = {};
      const mealbox = {};
      Object.keys(data).forEach((date) => {
        ["lunch", "dinner"].forEach((period) => {
          data[date][period].forEach((order) => {
            status[order.mrd_order_id] = order.mrd_order_status;
            mealbox[order.mrd_order_id] = null;
          });
        });
      });

      setOrderStatus(status);
      console.log("🚀 ~ fetchDeliveryList ~ mealbox:", mealbox);
      setMealboxPicked(mealbox);
    } catch (error) {
      console.error("Error fetching delivery list:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryList();
  }, [token, apiConfig]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && apiConfig) {
        fetchDeliveryList();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [token, apiConfig]);

  //MARK: Deliv Update
  const handleConfirm = (orderId, userId, menuId, mealboxPaid, date) => {
    const updatedStatus = orderStatus[orderId];
    const pickedMealbox = mealboxPicked[orderId];

    axios
      .post(
        `${apiConfig.apiBaseUrl}delivery-update`,
        {
          orderId: orderId,
          userId: userId,
          menuId: menuId,
          // giveMealbox: giveMealbox,
          mealboxPaid: mealboxPaid,
          delivStatus: updatedStatus,
          mboxPick: pickedMealbox,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Delivery updated successfully");
        fetchDeliveryList();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isButtonDisabled = (delivery) => {
    return (
      orderStatus[delivery.mrd_order_id] === "pending" ||
      ["cancelled", "delivered", "unavailable"].includes(
        delivery.mrd_order_status
      ) ||
      (delivery.mrd_user_has_mealbox !== "0" &&
        mealboxPicked[delivery.mrd_order_id] === null)
    );
  };

  return (
    <div className="container ">
      {Object.keys(deliveries).length === 0 ? (
        <div className="card_akm pad_akm">No deliveries</div>
      ) : (
        Object.keys(deliveries).map((date) => (
          <div key={date}>
            <h2 className="h2_akm">{dayjs(date).format("Do, MMM")}</h2>

            {["lunch", "dinner"].map((mealType) => (
              <div key={mealType}>
                <h3 className="h3_akm py_akm capitalize flex items-center  gap_akm">
                  {mealType == "lunch" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#FF4D00"
                      >
                        <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#131862"
                      >
                        <path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Z" />
                      </svg>
                    </>
                  )}

                  {mealType}
                  {mealType == "lunch" ? (
                    <div className="h4_akm">
                      Delivery time ({settings?.delivery_time_lunch || "N/A"})
                    </div>
                  ) : (
                    <div className="h4_akm">
                      Delivery time ({settings?.delivery_time_dinner || "N/A"})
                    </div>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap_akm">
                  {deliveries[date][mealType].length === 0 ? (
                    <div className="card_akm pad_akm">No deliveries</div>
                  ) : (
                    deliveries[date][mealType].map((delivery) => (
                      <div
                        key={delivery.mrd_order_id}
                        className={`card_akm pad_akm text-sm `}
                      >
                        {["cancelled", "delivered", "unavailable"].includes(
                          delivery.mrd_order_status
                        ) && (
                          <div
                            role="alert"
                            className={`alert ${
                              delivery.mrd_order_status === "delivered"
                                ? "alert-success"
                                : "alert-error"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 shrink-0 stroke-current"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={
                                  delivery.mrd_order_status === "delivered"
                                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                }
                              />
                            </svg>
                            <span>
                              {delivery.mrd_order_status === "delivered" &&
                                "Delivery completed."}
                              {delivery.mrd_order_status === "cancelled" &&
                                "Order cancelled."}
                              {delivery.mrd_order_status === "unavailable" &&
                                "Customer unavailable."}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center ">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <span>ঠিকানা:</span>
                          </div>
                          <div className=" w-3/4 py-1">
                            {delivery.mrd_user_address}
                          </div>
                        </div>

                        {delivery.mrd_user_delivery_instruction && (
                          <div className="flex items-center ">
                            <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                              <FontAwesomeIcon icon={faStickyNote} />
                              <span>ডেলিভারি নির্দেশনা:</span>
                            </div>
                            <div className=" w-3/4 py-1">
                              {delivery.mrd_user_delivery_instruction}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faUser} />
                            <span>নাম:</span>
                          </div>
                          <div className=" w-3/4 py-1">
                            {delivery.mrd_user_first_name}{" "}
                            <span className="text-xs">
                              (ওয়ালেট ব্যালেন্স: ৳{delivery.mrd_user_credit})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center ">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faMobileScreenButton} />
                            <span>ফোন:</span>
                          </div>
                          <div className=" w-3/4 py-1">
                            {delivery.mrd_user_phone}
                          </div>
                        </div>

                        <div className="flex items-center ">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faBoxOpen} />
                            <span>মিলবক্স ফেরত:</span>
                          </div>
                          <div className=" w-3/4 py-1">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-wrap gap-2">
                                {[
                                  ...Array(delivery.mrd_user_has_mealbox + 1),
                                ].map((_, index) => (
                                  <div
                                    key={`mealbox-${index}`}
                                    className="flex items-center gap-2 badge badge-ghost badge-lg badge-outline"
                                  >
                                    <input
                                      className="radio radio-error radio-sm"
                                      type="radio"
                                      name={`mealboxPicked-${delivery.mrd_order_id}`}
                                      value={index}
                                      checked={
                                        mealboxPicked[delivery.mrd_order_id] ===
                                        index
                                      }
                                      onChange={() =>
                                        setMealboxPicked((prev) => ({
                                          ...prev,
                                          [delivery.mrd_order_id]: index,
                                        }))
                                      }
                                    />
                                    {index}
                                  </div>
                                ))}
                              </div>

                              {/* <div className="flex items-center gap-2 badge badge-ghost badge-lg badge-outline ">
                                <input
                                  className="radio radio-error radio-sm"
                                  type="radio"
                                  name={`mealboxPicked-${delivery.mrd_order_id}`}
                                  value={0}
                                  checked={
                                    mealboxPicked[delivery.mrd_order_id] === 0
                                  }
                                  onChange={() =>
                                    setMealboxPicked((prev) => ({
                                      ...prev,
                                      [delivery.mrd_order_id]: 0,
                                    }))
                                  }
                                />{" "}
                                0
                              </div>
                              {delivery.mrd_user_has_mealbox == "1" && (
                                <div className="flex items-center gap-2 badge badge-ghost badge-lg badge-outline ">
                                  <input
                                    className="radio radio-error radio-sm"
                                    type="radio"
                                    name={`mealboxPicked-${delivery.mrd_order_id}`}
                                    value={1}
                                    checked={
                                      mealboxPicked[delivery.mrd_order_id] === 1
                                    }
                                    onChange={() =>
                                      setMealboxPicked((prev) => ({
                                        ...prev,
                                        [delivery.mrd_order_id]: 1,
                                      }))
                                    }
                                  />{" "}
                                  1
                                </div>
                              )}
                              {delivery.mrd_user_has_mealbox == "2" && (
                                <div className="flex items-center gap-2 badge badge-ghost badge-lg badge-outline ">
                                  <input
                                    className="radio radio-error radio-sm"
                                    type="radio"
                                    name={`mealboxPicked-${delivery.mrd_order_id}`}
                                    value={2}
                                    checked={
                                      mealboxPicked[delivery.mrd_order_id] === 2
                                    }
                                    onChange={() =>
                                      setMealboxPicked((prev) => ({
                                        ...prev,
                                        [delivery.mrd_order_id]: 2,
                                      }))
                                    }
                                  />
                                  2
                                </div>
                              )} */}
                              <div
                                className="tooltip"
                                data-tip="ইউজারের কাছে আমাদের আগের কোন মিলবক্স থাকলে সেটা কালেক্ট করে এখানে মার্ক করে ফেরত নিয়ে আসুন। &bull; ইউজারের কাছে দুইটা মিল বক্স থাকলে  তাকে ওয়ান টাইম  কন্টেইনারে দেওয়া হবে"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="#4287f5"
                                >
                                  <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-1">
                              {delivery.mrd_user_has_mealbox == "0" ? (
                                <div className="text-xs">
                                  (0 সিলেক্ট করুন, ইউজারের কাছে আমাদের কোন
                                  মিলবক্স নেই)
                                </div>
                              ) : delivery.mrd_user_has_mealbox == "1" ? (
                                <div className="text-xs">
                                  (ইউজারের কাছে আমাদের ১ টা মিলবক্স আছে, ফেরত
                                  আনুন)
                                </div>
                              ) : delivery.mrd_user_has_mealbox == "2" ? (
                                <div className="text-xs">
                                  (ইউজারের কাছে আমাদের ২ টা মিলবক্স আছে, ফেরত
                                  আনুন)
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center ">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faBowlFood} />
                            <span>মিল দিন:</span>
                          </div>
                          <div className=" w-3/4  flex flex-col items-center py_akm">
                            <div className="grid grid-cols-2">
                              <div>
                                মিলবক্স সহ:{" "}
                                <Chip size="lg" variant="bordered">
                                  {delivery.mrd_order_mealbox}
                                </Chip>
                              </div>
                              <div>
                                ওয়ান টাইম বক্স:{" "}
                                <Chip size="lg" variant="bordered">
                                  {delivery.mrd_order_mealbox === 0 ||
                                  delivery.mrd_order_mealbox === null ? (
                                    delivery.mrd_order_quantity
                                  ) : (
                                    <>0</>
                                  )}
                                </Chip>
                              </div>
                            </div>
                            {/* {delivery.mrd_order_mealbox != "" &&
                              delivery.mrd_user_has_mealbox <
                                delivery.mrd_order_quantity && (
                                
                              )} */}

                            {/* {delivery.mrd_order_mealbox === 1 &&
                              delivery.mrd_user_has_mealbox === 2 && (
                                <>
                                  {delivery.mrd_order_quantity === 1 && (
                                    <div className="grid grid-cols-2">
                                      <div>
                                        মিলবক্স সহ:{" "}
                                        <Chip size="lg" variant="bordered">
                                          0
                                        </Chip>
                                      </div>
                                      <div>
                                        ওয়ান টাইম বক্স:{" "}
                                        <Chip size="lg" variant="bordered">
                                          1
                                        </Chip>
                                      </div>
                                    </div>
                                  )}
                                  {delivery.mrd_order_quantity === 2 && (
                                    <div className="grid grid-cols-2">
                                      <div>
                                        মিলবক্স সহ:{" "}
                                        <Chip size="lg" variant="bordered">
                                          0
                                        </Chip>
                                      </div>
                                      <div>
                                        ওয়ান টাইম বক্স:{" "}
                                        <Chip size="lg" variant="bordered">
                                          2
                                        </Chip>
                                      </div>
                                    </div>
                                  )}
                                  {delivery.mrd_order_quantity === 3 && (
                                    <div className="grid grid-cols-2">
                                      <div>
                                        মিলবক্স সহ:{" "}
                                        <Chip size="lg" variant="bordered">
                                          0
                                        </Chip>
                                      </div>
                                      <div>
                                        ওয়ান টাইম বক্স:{" "}
                                        <Chip size="lg" variant="bordered">
                                          3
                                        </Chip>
                                      </div>
                                    </div>
                                  )}
                                  {delivery.mrd_order_quantity === 4 && (
                                    <div className="grid grid-cols-2">
                                      <div>
                                        মিলবক্স সহ:{" "}
                                        <Chip size="lg" variant="bordered">
                                          0
                                        </Chip>
                                      </div>
                                      <div>
                                        ওয়ান টাইম বক্স:{" "}
                                        <Chip size="lg" variant="bordered">
                                          4
                                        </Chip>
                                      </div>
                                    </div>
                                  )}
                                  {delivery.mrd_order_quantity === 5 && (
                                    <div className="grid grid-cols-2">
                                      <div>
                                        মিলবক্স সহ:{" "}
                                        <Chip size="lg" variant="bordered">
                                          0
                                        </Chip>
                                      </div>
                                      <div>
                                        ওয়ান টাইম বক্স:{" "}
                                        <Chip size="lg" variant="bordered">
                                          5
                                        </Chip>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                            {delivery.mrd_order_mealbox === 0 && (
                              <>
                                {delivery.mrd_order_quantity === 1 && (
                                  <div className="grid grid-cols-2">
                                    <div>
                                      মিলবক্স সহ:{" "}
                                      <Chip size="lg" variant="bordered">
                                        0
                                      </Chip>
                                    </div>
                                    <div>
                                      ওয়ান টাইম বক্স:{" "}
                                      <Chip size="lg" variant="bordered">
                                        1
                                      </Chip>
                                    </div>
                                  </div>
                                )}
                                {delivery.mrd_order_quantity === 2 && (
                                  <div className="grid grid-cols-2">
                                    <div>
                                      মিলবক্স সহ:{" "}
                                      <Chip size="lg" variant="bordered">
                                        0
                                      </Chip>
                                    </div>
                                    <div>
                                      ওয়ান টাইম বক্স:{" "}
                                      <Chip size="lg" variant="bordered">
                                        2
                                      </Chip>
                                    </div>
                                  </div>
                                )}
                                {delivery.mrd_order_quantity === 3 && (
                                  <div className="grid grid-cols-2">
                                    <div>
                                      মিলবক্স সহ:{" "}
                                      <Chip size="lg" variant="bordered">
                                        0
                                      </Chip>
                                    </div>
                                    <div>
                                      ওয়ান টাইম বক্স:{" "}
                                      <Chip size="lg" variant="bordered">
                                        3
                                      </Chip>
                                    </div>
                                  </div>
                                )}
                                {delivery.mrd_order_quantity === 4 && (
                                  <div className="grid grid-cols-2">
                                    <div>
                                      মিলবক্স সহ:{" "}
                                      <Chip size="lg" variant="bordered">
                                        0
                                      </Chip>
                                    </div>
                                    <div>
                                      ওয়ান টাইম বক্স:{" "}
                                      <Chip size="lg" variant="bordered">
                                        4
                                      </Chip>
                                    </div>
                                  </div>
                                )}
                                {delivery.mrd_order_quantity === 5 && (
                                  <div className="grid grid-cols-2">
                                    <div>
                                      মিলবক্স সহ:{" "}
                                      <Chip size="lg" variant="bordered">
                                        0
                                      </Chip>
                                    </div>
                                    <div>
                                      ওয়ান টাইম বক্স:{" "}
                                      <Chip size="lg" variant="bordered">
                                        5
                                      </Chip>
                                    </div>
                                  </div>
                                )}
                              </>
                            )} */}
                            {delivery.food_details ? (
                              <div className="flex flex-row gap-1">
                                {delivery.food_details.map((food, index) => (
                                  <div
                                    key={food.mrd_food_id}
                                    className="badge badge-soft badge-primary"
                                  >
                                    {food.mrd_food_name}
                                    {/* {index < delivery.food_details.length - 1
                                      ? ", "
                                      : ""} */}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="no-food-details">
                                Current day default food items
                              </div>
                            )}
                          </div>
                        </div>

                        {delivery.mrd_user_mealbox_paid == "0" &&
                          delivery.mrd_order_mealbox == "1" && (
                            <div className="flex items-center ">
                              <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                                <FontAwesomeIcon icon={faCoins} />
                                <span>নতুন মিলবক্সের দাম:</span>
                              </div>
                              <div className=" w-3/4 py-1 flex items-center gap_akm">
                                ৳{delivery.mrd_setting_mealbox_price}
                                <div
                                  className="tooltip"
                                  data-tip="মিল বক্সের দাম ক্যাশ অন ডেলিভারিতে নিতে হবে।"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#4287f5"
                                  >
                                    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="flex items-center ">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <FontAwesomeIcon icon={faMoneyBill} />
                            <span>মোট মিলের দাম:</span>
                          </div>
                          <div className=" w-3/4 py-1 flex gap-2">
                            ৳{delivery.mrd_order_total_price}
                            <div className="text-xs font-normal">
                              (ডেলিভারি চার্জ সহ)
                            </div>
                            {/* {delivery.mrd_order_cash_to_get == "0" ? (
                            <div className="text-xs font-normal">
                              (মিলের টাকা ওয়ালেট থেকে পরিশোধ করা হয়েছে)
                            </div>
                          ) : (
                            <>
                              {delivery.mrd_user_credit != "0" &&
                                delivery.mrd_user_credit <
                                  delivery.mrd_order_cash_to_get && (
                                  <div>
                                    (৳{delivery.mrd_user_credit} ওয়ালেট থেকে
                                    পরিশোধ করা হয়েছে)
                                  </div>
                                )}
                            </>
                          )} */}
                          </div>
                        </div>

                        <div className="flex items-center flex-row">
                          <div className="flex items-center  w-1/4 py-1 font-bold gap_akm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="green"
                            >
                              <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
                            </svg>
                            <span> টাকা নিন:</span>
                          </div>
                          <div className=" w-3/4 py-1 h2_akm flex items-center flex-row gap_akm">
                            {/* if mealbox give = yes
                            if mealbox paid = yes
                            Then only show "cash to get" (not the mealbox price)
                            
                            TK 95 + 25 (deliv charge)
                            */}

                            <div>{delivery.mrd_order_cash_to_get}</div>
                            {/* {delivery.mrd_order_mealbox == "1" && (
                              <div>
                                {delivery.mrd_user_mealbox_paid == "1" && (
                                  <div>{delivery.mrd_order_cash_to_get}</div>
                                )}
                              </div>
                            )} */}
                            {/* if mealbox give = yes
                            if mealbox paid = no
                            Then show cash to get + mealbox_price 
                            
                            TK 95 + 90 + 25 (deliv charge)
                            */}
                            {/* {delivery.mrd_order_mealbox == "1" && (
                              <div>
                                {delivery.mrd_user_mealbox_paid == "0" && (
                                  <div>
                                    {delivery.mrd_order_cash_to_get +
                                      delivery.mrd_setting_mealbox_price}
                                  </div>
                                )}
                              </div>
                            )} */}

                            {/* if no meal box, then only show cash to get */}
                            {/* {delivery.mrd_order_mealbox == "0" && (
                              <div>{delivery.mrd_order_cash_to_get}</div>
                            )} */}

                            <div className=" w-3/4 py-1 text-xs font-normal">
                              {delivery.mrd_order_cash_to_get == "0" ? (
                                <div className="text-xs font-normal">
                                  (মিলের ৳{delivery.mrd_order_total_price} টাকা
                                  + ডেলিভারি চার্জ ৳
                                  {delivery.mrd_order_deliv_commission} টাকা
                                  ওয়ালেট থেকে পরিশোধ করা হয়েছে)
                                </div>
                              ) : (
                                <>
                                  {/* 
                                  if cash to get > 0
                                  Here we are adding credit + deliv comm, and if their sum is less than cash to get, then show message.

                                  meal: 95 + deliv: 25 = 120 tk                      
                                  credit: 50 tk

                                  if (120 > 50)
                                  */}
                                  {delivery.mrd_user_credit +
                                    delivery.mrd_order_deliv_commission >
                                    delivery.mrd_order_cash_to_get && (
                                    <div>
                                      (৳{delivery.mrd_user_credit} টাকা ওয়ালেট
                                      থেকে পরিশোধ করা হয়েছে)
                                    </div>
                                  )}
                                  {/* If cash to get = deliv comm/deliv charge 
                                  
                                  CTG = 95
                                  Credit = 95
                                  if (95 == 95)
                                  
                                  */}

                                  {delivery.mrd_order_cash_to_get ==
                                    delivery.mrd_user_credit && (
                                    <div>
                                      (মিলের ৳{delivery.mrd_user_credit}
                                      টাকা ওয়ালেট থেকে পরিশোধ করা হয়েছে)
                                    </div>
                                  )}

                                  {/* {delivery.mrd_order_total_price ==
                                    delivery.mrd_user_credit && (
                                    <div>
                                      (মিলের ৳{delivery.mrd_user_credit}
                                      টাকা ওয়ালেট থেকে পরিশোধ করা হয়েছে)
                                    </div>
                                  )} */}
                                </>
                              )}
                            </div>
                            {/* <div className="text-xs">
                            order_cash_to_get: {delivery.mrd_order_cash_to_get}{" "}
                            <br />
                            order_mealbox: {delivery.mrd_order_mealbox}
                            <br />
                            user_mealbox_paid: {delivery.mrd_user_mealbox_paid}
                            <br />
                            user_has_mealbox: {delivery.mrd_user_has_mealbox}
                            <br />
                          </div> */}
                          </div>
                        </div>

                        <div className="flex items-center ">
                          <div
                            htmlFor={`status-${delivery.mrd_order_id}`}
                            className="flex items-center  w-1/4 py-1 font-bold gap_akm"
                          >
                            <span> ডেলিভারি স্ট্যাটাস:</span>
                          </div>
                          <div className=" w-3/4 py-1 flex items-center gap_akm">
                            <select
                              id={`status-${delivery.mrd_order_id}`}
                              value={orderStatus[delivery.mrd_order_id]}
                              onChange={(e) =>
                                setOrderStatus((prev) => ({
                                  ...prev,
                                  [delivery.mrd_order_id]: e.target.value,
                                }))
                              }
                              className="ml-2 p-2 border rounded"
                              disabled={[
                                "cancelled",
                                "delivered",
                                "unavailable",
                              ].includes(delivery.mrd_order_status)}
                            >
                              <option value="pending">Pending</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="delivered">Delivered</option>
                              <option value="unavailable">Unavailable</option>
                            </select>
                            <button
                              className={`px-4 py-2  rounded flex justify-center gap_akm ${
                                orderStatus[delivery.mrd_order_id] ===
                                  "pending" ||
                                [
                                  "cancelled",
                                  "delivered",
                                  "unavailable",
                                ].includes(delivery.mrd_order_status) ||
                                isButtonDisabled(delivery)
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue-500 text-white"
                              }`}
                              onClick={() =>
                                handleConfirm(
                                  delivery.mrd_order_id,
                                  delivery.mrd_user_id,
                                  delivery.mrd_menu_id,
                                  delivery.mrd_order_mealbox,
                                  delivery.mrd_user_mealbox_paid,
                                  date
                                )
                              }
                              disabled={isButtonDisabled(delivery)}
                            >
                              {[
                                "cancelled",
                                "delivered",
                                "unavailable",
                              ].includes(delivery.mrd_order_status) ? (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#75FB4C"
                                  >
                                    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#FFFF55"
                                  >
                                    <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
                                  </svg>
                                </>
                              )}
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryList;
