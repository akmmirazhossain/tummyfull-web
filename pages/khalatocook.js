// pages/wallet.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/bn";
import { Card, CardBody, Chip, Divider } from "@nextui-org/react";

const toBanglaNumber = (num) =>
  num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const KhalaToCook = () => {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState("");
  const [weekday, setWeekday] = useState("");
  const specialPhones = ["01748936454", "01673692997", "01775868104"];
  const [periodLabel, setPeriodLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "https://apis.dalbhath.com/api/orderlist-chef-now"
      );

      if (res.data && res.data.orders) {
        setOrders(res.data.orders);

        const bnDate = dayjs(res.data.currentDateTime)
          .locale("bn")
          .format("MMMM D, YYYY");
        const bnWeekday = dayjs(res.data.currentDateTime)
          .locale("bn")
          .format("dddd");
        setDate(bnDate);
        setWeekday(bnWeekday);

        const period =
          res.data.orders.length > 0
            ? res.data.orders[0].mrd_menu_period
            : "dinner";

        let periodLabel = "";
        if (period === "lunch") {
          periodLabel = "☀️ দুপুরের রান্না";
        } else if (period === "dinner") {
          periodLabel = "🌙 রাতের রান্না";
        }
        setPeriodLabel(periodLabel);
      }
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  const foodCountMap = {};
  orders.forEach((order) => {
    order.food_details.forEach((food) => {
      if (!foodCountMap[food.mrd_food_name]) {
        foodCountMap[food.mrd_food_name] = 0;
      }
      foodCountMap[food.mrd_food_name] += order.mrd_order_quantity;
    });
  });

  const specialOrders = orders.filter((order) =>
    specialPhones.includes(order.mrd_user_phone)
  );

  return (
    <div className="max-w-lg mx-auto pad_akm space-y-4">
      <Card className="pad_akm">
        <CardBody className="flex justify-center items-center text-center space-y-2">
          <h2 className="text-lg ">{date}</h2>
          <p className="text-2xl font-bold">{weekday}</p>
          <p className="text-xl "> {periodLabel}</p>
          <Divider className="my-4" />
          <div className="grid grid-cols-2 gap-2">
            {loading ? (
              <div className="col-span-2 flex justify-center items-center py-4 ">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : Object.keys(foodCountMap).length === 0 ? (
              <div className="col-span-2 text-center text-red-500 font-semibold">
                আপাতত কোন রান্না নেই
              </div>
            ) : (
              Object.entries(foodCountMap).map(([name, qty], index) => (
                <div
                  key={index}
                  className="flex gap-1 justify-between items-center pad_akm rounded-lg bg-white"
                >
                  <span className="text-base font-medium">{name}</span>
                  <Chip size="lg" variant="flat" className="font-bold text-lg">
                    {toBanglaNumber(qty)}
                  </Chip>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      <div className="space-y-2 ">
        {specialOrders.length > 0 && (
          <div className="border p-3 rounded-lg bg-yellow-50 shadow space-y-2 pad_akm">
            <p className="text-2xl font-semibold text-orange-600 pb_akm">
              বাসার টেবিলে রাখেন:
            </p>
            {specialOrders.map((order, idx) => {
              const foodMap = {};
              order.food_details.forEach((food) => {
                if (!foodMap[food.mrd_food_name])
                  foodMap[food.mrd_food_name] = 0;
                foodMap[food.mrd_food_name] += order.mrd_order_quantity;
              });

              return (
                <div
                  key={`special-${idx}`}
                  className="space-y-1 pb_akm text_black"
                >
                  <p className="font-bold ">
                    {order.mrd_user_first_name} এর খাবার
                  </p>
                  <p className="text-base flex flex-wrap gap-3 ">
                    {Object.entries(foodMap).map(([name, qty], idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        {name}
                        <Chip size="lg" variant="flat">
                          {toBanglaNumber(qty)}
                        </Chip>
                      </span>
                    ))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KhalaToCook;
