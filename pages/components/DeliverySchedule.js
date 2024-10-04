import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";
import dayjs from "dayjs";

const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [orderStatus, setOrderStatus] = useState({});
  const [mealboxPicked, setMealboxPicked] = useState({});
  const apiConfig = useContext(ApiContext);

  const token = Cookies.get("TFLoginToken");

  const fetchDeliveryList = async () => {
    if (!apiConfig) return;
    try {
      const response = await axios.get(`${apiConfig.apiBaseUrl}delivery-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      setDeliveries(data);

      // Set default order status and mealbox picked states
      const status = {};
      const mealbox = {};
      Object.keys(data).forEach((date) => {
        ["lunch", "dinner"].forEach((period) => {
          data[date][period].forEach((order) => {
            status[order.mrd_order_id] = order.mrd_order_status;
            // mealbox[order.mrd_order_id] = order.mrd_user_has_mealbox;
            mealbox[order.mrd_order_id] = null;
          });
        });
      });

      setOrderStatus(status);
      setMealboxPicked(mealbox);
    } catch (error) {
      console.error("Error fetching delivery list:", error);
    }
  };

  useEffect(() => {
    fetchDeliveryList();
  }, [token, apiConfig]);

  //MARK: Deliv Update
  const handleConfirm = (orderId, userId, menuId, mealboxPaid) => {
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
                <h3 className="h3_akm py_akm capitalize flex gap_akm">
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
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {deliveries[date][mealType].map((delivery) => (
                    <div key={date}>
                      <table
                        key={delivery.mrd_order_id}
                        className="table card_akm py_akm"
                      >
                        <tbody>
                          <tr>
                            <th>ঠিকানা:</th>
                            <td>{delivery.mrd_user_address}</td>
                          </tr>

                          {delivery.mrd_user_delivery_instruction && (
                            <tr>
                              <th>ডেলিভারি নির্দেশনা:</th>
                              <td>{delivery.mrd_user_delivery_instruction}</td>
                            </tr>
                          )}

                          <tr>
                            <th>নাম:</th>
                            <td>
                              {delivery.mrd_user_first_name} &bull;{" "}
                              <span className="text-xs">
                                (Current Credit: {delivery.mrd_user_credit})
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>ফোন:</th>
                            <td>{delivery.mrd_user_phone}</td>
                          </tr>

                          {delivery.mrd_order_mealbox == 1 &&
                            delivery.mrd_user_has_mealbox < 2 && (
                              <tr>
                                <th>
                                  <div className="flex items-center">
                                    <span>মিলবক্স দিন:</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="24px"
                                      viewBox="0 -960 960 960"
                                      width="24px"
                                      fill="red"
                                    >
                                      <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                                    </svg>
                                  </div>
                                  <div className="text-xs">(খাবার সহ )</div>
                                </th>
                                <td>1 </td>
                              </tr>
                            )}

                          <tr>
                            <th>
                              <div className="flex items-center">
                                <span> মিলবক্স ফেরত: </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="green"
                                >
                                  <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                                </svg>
                              </div>
                              <div className="text-xs">(পূর্বের)</div>
                            </th>
                            <td>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 badge badge-ghost badge-lg badge-outline ">
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
                                        mealboxPicked[delivery.mrd_order_id] ===
                                        1
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
                                        mealboxPicked[delivery.mrd_order_id] ===
                                        2
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
                                )}
                                <div
                                  className="tooltip"
                                  data-tip="ইউজারের কাছে আমাদের আগের কোন মিলবক্স থাকলে সেটা কালেক্ট করে এখানে মার্ক করে ফেরত নিয়ে আসুন।"
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
                            </td>
                          </tr>

                          <tr>
                            <th>মোট মিলের সংখ্যা:</th>
                            <td className="flex items-center gap_akm">
                              {delivery.mrd_order_quantity}{" "}
                              <div
                                className="tooltip"
                                data-tip="মিলবক্স সহ/ছাড়া মোট মিলের সংখ্যা"
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
                            </td>
                          </tr>

                          {delivery.mrd_user_mealbox_paid == "0" && (
                            <tr>
                              <th>নতুন মিলবক্সের দাম:</th>
                              <td>{delivery.mrd_setting_mealbox_price}</td>
                            </tr>
                          )}
                          <tr>
                            <th>মোট মিলের দাম:</th>
                            <td>
                              {delivery.mrd_order_total_price}{" "}
                              {delivery.mrd_order_cash_to_get == "0" && (
                                <div className="text-xs font-normal">
                                  (মিলের টাকা ওয়ালেট থেকে পরিশোধ করা হয়েছে)
                                </div>
                              )}
                            </td>
                          </tr>

                          <tr>
                            <th>
                              <div className="flex items-center space-x-2">
                                <span> টাকা নিন:</span>

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="green"
                                >
                                  <path d="M560-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM280-320q-33 0-56.5-23.5T200-400v-320q0-33 23.5-56.5T280-800h560q33 0 56.5 23.5T920-720v320q0 33-23.5 56.5T840-320H280Zm80-80h400q0-33 23.5-56.5T840-480v-160q-33 0-56.5-23.5T760-720H360q0 33-23.5 56.5T280-640v160q33 0 56.5 23.5T360-400Zm440 240H120q-33 0-56.5-23.5T40-240v-440h80v440h680v80ZM280-400v-320 320Z" />
                                </svg>
                              </div>
                            </th>
                            <td className="h2_akm">
                              {delivery.mrd_user_mealbox_paid
                                ? delivery.mrd_order_cash_to_get
                                : delivery.mrd_order_cash_to_get +
                                  delivery.mrd_setting_mealbox_price}{" "}
                            </td>
                          </tr>
                          <tr>
                            <th htmlFor={`status-${delivery.mrd_order_id}`}>
                              ডেলিভারি স্ট্যাটাস:
                            </th>
                            <td className="flex items-center gap_akm">
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
                                    delivery.mrd_user_mealbox_paid
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
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ))}
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
