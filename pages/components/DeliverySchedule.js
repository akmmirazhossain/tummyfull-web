import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ApiContext } from "../contexts/ApiContext";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { useRouter } from "next/router";

const Deliveries = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delivFetchRefresh, setDelivFetchRefresh] = useState(0);

  const [selectedKey, setSelectedKey] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const router = useRouter();
  const apiConfig = useContext(ApiContext);

  useEffect(() => {
    if (!apiConfig) return;

    axios
      .get(`${apiConfig.apiBaseUrl}delivery-list`)
      .then((response) => {
        setData(response.data);
        console.log("DeliverySchedule.js ->", response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [apiConfig, delivFetchRefresh]);

  //MARK: MealboxColl
  const mealboxCollected = (mrd_order_id) => {
    console.log(mrd_order_id);
  };

  //MARK: deliv Stat
  const deliveryStatusUpdate = (
    selectedKey,
    orderId,
    userId,
    mealType,
    menuId
  ) => {
    const deliveredStatus = Array.from(selectedKey)[0];

    //DELIVERY
    axios({
      method: "get",
      url: `${apiConfig.apiBaseUrl}delivery-update`,
      params: {
        delivStatus: deliveredStatus,
        orderId: orderId,
        userId: userId,
        mealType: mealType,
        menuId: menuId,
      },
    }).then(
      (response) => {
        console.log(response.data); // Adjusted to print response data
      },
      (error) => {
        console.error(error);
      }
    );
    setDelivFetchRefresh((prev) => prev + 1);
    setSelectedKey(selectedKey);
    setOrderId(orderId);
    // router.reload();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="h1_akm">Delivery page</div>
      {Object.entries(data).map(([date, meals]) => (
        <div key={date} className="card_akm pad_akm space-y-4 mb_akm">
          <h2 className="h2_akm">{date}</h2>
          {/* Sort meal types to ensure lunch is always displayed before dinner */}
          {["lunch", "dinner"].map(
            (mealType) =>
              meals[mealType] && (
                <div key={mealType} className="mb-2">
                  <div className="h3_akm font-semibold capitalize">
                    {mealType}
                  </div>

                  <div className="grid grid-cols-8">
                    <div>Give mealbox</div>
                    <div>Address</div>
                    <div>Phone</div>
                    <div>Name</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div>Cash to Collect</div>
                    {/* <div>Mealbox collected</div> */}
                    <div>Status</div>
                  </div>

                  {meals[mealType].map((item, index) => (
                    <div key={index} className="grid grid-cols-8">
                      <div className="border border-gray-200 p-2">
                        {item.mrd_order_mealbox}
                      </div>
                      <div className="border border-gray-200 p-2">
                        {item.mrd_user_address}
                      </div>
                      <div className="border border-gray-200 p-2">
                        {item.mrd_user_phone}
                      </div>
                      <div className="border border-gray-200 p-2">
                        {item.mrd_user_first_name}
                      </div>
                      <div className="border border-gray-200 p-2">
                        {item.mrd_order_quantity}
                      </div>
                      <div className="border border-gray-200 p-2">
                        {item.mrd_order_total_price}
                      </div>

                      <div className="border border-gray-200 p-2">
                        {item.mrd_order_cash_to_get}
                      </div>

                      {/* <div className="border border-gray-200 flex items-center justify-center">
                        <Checkbox
                          onChange={() => mealboxCollected(item.mrd_order_id)}
                          size="lg"
                        >
                          Yes
                        </Checkbox>
                      </div> */}

                      <div className="border border-gray-200 flex items-center justify-center">
                        {/* //MARK: DROPDOWN */}
                        <Dropdown className="text-black">
                          <DropdownTrigger>
                            <Button
                              variant="bordered"
                              className="capitalize"
                              isDisabled={
                                item.mrd_order_status === "delivered" ||
                                item.mrd_order_status === "cancelled"
                              }
                            >
                              {selectedKey === null
                                ? item.mrd_order_status
                                : orderId === item.mrd_order_id
                                ? selectedKey
                                : item.mrd_order_status}
                            </Button>
                          </DropdownTrigger>
                          {console.log("selectedKey:", selectedKey)}
                          <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                            onSelectionChange={(selectedKey) =>
                              deliveryStatusUpdate(
                                selectedKey,

                                item.mrd_order_id,
                                item.mrd_user_id,
                                mealType,
                                item.mrd_menu_id
                              )
                            }
                          >
                            <DropdownItem key="pending" className="p-2">
                              Pending
                            </DropdownItem>
                            <DropdownItem
                              key="delivered"
                              className="p-2 text-green-600 font-bold"
                            >
                              Delivered
                            </DropdownItem>
                            <DropdownItem
                              key="delivered_with_due"
                              className="p-2"
                            >
                              Delivered with due
                            </DropdownItem>
                            <DropdownItem key="cancelled" className="p-2">
                              Cancelled
                            </DropdownItem>
                            <DropdownItem key="unavailable" className="p-2">
                              Unavailable
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
                </div>
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Deliveries;
