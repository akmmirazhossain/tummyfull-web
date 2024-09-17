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
  Chip,
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
          <h2 className="h2_akm my_akm">{date}</h2>
          {/* Sort meal types to ensure lunch is always displayed before dinner */}
          {["lunch", "dinner"].map(
            (mealType) =>
              meals[mealType] && (
                <div key={mealType}>
                  <div className="h3_akm mb_akm font-semibold capitalize">
                    {mealType}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 mx-auto gap_akm ">
                    {meals[mealType].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col  border border-gray-200 rounded-lg shadow-lg"
                      >
                        <div className="flex items-center justify-center  border-b border-gray-200 pad_akm">
                          <div className="flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full h2_akm text-white">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Name
                          </div>
                          <div className="w-3/5 pad_akm">
                            {" "}
                            {item.mrd_user_first_name}
                          </div>
                        </div>

                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Phone
                          </div>
                          <div className="w-3/5 pad_akm">
                            {" "}
                            {item.mrd_user_phone}
                          </div>
                        </div>
                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Give mealbox
                          </div>
                          <div className="w-3/5 pad_akm">
                            {item.mrd_order_mealbox === 1 ? (
                              <Chip color="success">Yes</Chip>
                            ) : (
                              <Chip color="danger">No</Chip>
                            )}
                          </div>
                        </div>
                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Address
                          </div>
                          <div className="w-3/5 pad_akm">
                            {item.mrd_user_address}
                          </div>
                        </div>

                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Quantity
                          </div>
                          <div className="w-3/5 pad_akm">
                            {item.mrd_order_quantity}
                          </div>
                        </div>

                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Cash to Collect
                          </div>
                          <div className="w-3/5 pad_akm">
                            {item.mrd_order_cash_to_get}
                          </div>
                        </div>

                        <div className="flex  border-b border-gray-200">
                          <div className="w-2/5 bg-gray-100 font-semibold text-right pad_akm">
                            Delivery Status
                          </div>
                          <div className="w-3/5 pad_akm">
                            <Dropdown className="text-black">
                              <DropdownTrigger>
                                <Button
                                  size="lg"
                                  variant="bordered"
                                  className="capitalize"
                                  isDisabled={
                                    item.mrd_order_status === "delivered" ||
                                    item.mrd_order_status === "cancelled" ||
                                    item.mrd_order_status === "unavailable"
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
                                {/* <DropdownItem
                              key="delivered_with_due"
                              className="p-2"
                            >
                              Delivered with due
                            </DropdownItem> */}
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
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Deliveries;
