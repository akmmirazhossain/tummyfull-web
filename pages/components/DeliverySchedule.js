import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ApiContext } from "../contexts/ApiContext";

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
      .then((response) => {
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
    <div className="container mx-auto p-4">
      {Object.keys(deliveries).map((date) => (
        <div key={date}>
          <h2 className="text-xl font-bold mb-4">{date}</h2>

          {["lunch", "dinner"].map((mealType) => (
            <div key={mealType}>
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {mealType}
              </h3>

              {deliveries[date][mealType].map((delivery) => (
                <>
                  <table className="table card_akm">
                    {/* head */}
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <th>1</th>
                        <td>Cy Ganderton</td>
                        <td>Quality Control Specialist</td>
                        <td>Blue</td>
                      </tr>
                      {/* row 2 */}
                      <tr>
                        <th>2</th>
                        <td>Hart Hagerty</td>
                        <td>Desktop Support Technician</td>
                        <td>Purple</td>
                      </tr>
                      {/* row 3 */}
                      <tr>
                        <th>3</th>
                        <td>Brice Swyre</td>
                        <td>Tax Accountant</td>
                        <td>Red</td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    key={delivery.mrd_order_id}
                    className="bg-gray-100 p-4 mb-4 rounded shadow-md"
                  >
                    <p>Address: {delivery.mrd_user_address}</p>
                    <p>
                      Delivery Instruction:{" "}
                      {delivery.mrd_user_delivery_instruction || "None"}
                    </p>
                    <p>Customer Name: {delivery.mrd_user_first_name}</p>
                    <p className="border-b mb_akm">
                      Phone: {delivery.mrd_user_phone}
                    </p>

                    {delivery.mrd_order_mealbox == 1 &&
                      delivery.mrd_user_has_mealbox < 2 && (
                        <p className="border-yellow-600 border-2 pad_akm">
                          Give Mealbox to the customer:{" "}
                          <span className="text-green-600">YES</span>
                        </p>
                      )}
                    {delivery.mrd_user_has_mealbox != "0" && (
                      <div className="border border-red-700">
                        <p>Has Mealbox: {delivery.mrd_user_has_mealbox}</p>
                        <span className="text-xs">
                          (Show if user has mealbox)
                        </span>
                        <div className="mt-2 gap-2">
                          <label className="ml-4">
                            <input
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
                            0 Picked
                          </label>

                          {delivery.mrd_user_has_mealbox == "1" && (
                            <label>
                              <input
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
                              />
                              1 Picked
                            </label>
                          )}

                          {delivery.mrd_user_has_mealbox == "2" && (
                            <label>
                              <input
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
                              />{" "}
                              2 Picked
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Display total price calculation */}

                    {/* <p>Mealbox Paid: {delivery.mrd_user_mealbox_paid}</p> */}

                    {delivery.mrd_user_mealbox_paid == "0" && (
                      <p className=" border-blue-600 border-2 pad_akm">
                        New Mealbox Price: {delivery.mrd_setting_mealbox_price}{" "}
                        <span className="text-xs">
                          (Show if mealbox unpaid)
                        </span>
                      </p>
                    )}

                    <p>Order Quantity: {delivery.mrd_order_quantity}</p>
                    <p className=" border-green-600 border-2 pad_akm">
                      Meal Price: {delivery.mrd_order_total_price}
                      <span className="text-xs">
                        {" "}
                        (can be deducted from wallet)
                      </span>
                    </p>
                    <p>
                      Cash to Collect:
                      <span className="h2_akm">
                        {delivery.mrd_user_mealbox_paid
                          ? delivery.mrd_order_cash_to_get
                          : delivery.mrd_order_cash_to_get +
                            delivery.mrd_setting_mealbox_price}
                      </span>
                    </p>

                    {/* Dropdown for order status */}
                    <div className="mt-2">
                      <label htmlFor={`status-${delivery.mrd_order_id}`}>
                        Order Status:
                      </label>

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
                    </div>

                    <button
                      className={`mt-4 px-4 py-2 rounded flex justify-center gap_akm ${
                        orderStatus[delivery.mrd_order_id] === "pending" ||
                        ["cancelled", "delivered", "unavailable"].includes(
                          delivery.mrd_order_status
                        ) ||
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
                      {["cancelled", "delivered", "unavailable"].includes(
                        delivery.mrd_order_status
                      ) ? (
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
                </>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DeliveryList;
