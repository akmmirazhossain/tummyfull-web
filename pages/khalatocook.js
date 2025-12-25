// pages/wallet.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/bn";

const toBanglaNumber = (num) =>
  num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const KhalaToCook = () => {
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState("");
  const [weekday, setWeekday] = useState("");
  const specialPhones = [];
  const [periodLabel, setPeriodLabel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
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
        foodCountMap[food.mrd_food_name] = { qty: 0, img: food.mrd_food_img };
      }
      foodCountMap[food.mrd_food_name].qty += order.mrd_order_quantity;
    });
  });

  const specialOrders = orders.filter((order) =>
    specialPhones.includes(order.mrd_user_phone)
  );

  const [nextCurry, setNextCurry] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("https://apis.dalbhath.com/api/menu");

      const menu = res.data;

      const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
      const now = dayjs();
      const currentDay = days[now.day()];
      const currentHour = now.hour();

      // Determine next meal time
      let nextDay = currentDay;
      let nextPeriod = "dinner";

      if (currentHour >= 0 && currentHour < 14) {
        // Morning → upcoming is today's dinner
        nextDay = currentDay;
        nextPeriod = "dinner";
      } else {
        // Afternoon → upcoming is tomorrow's lunch
        const nextDayIndex = (now.day() + 1) % 7;
        nextDay = days[nextDayIndex];
        nextPeriod = "lunch";
      }

      // 🍛 CURRY 1
      let nextCurry = null;
      // 🍛 CURRY 2 (fallback to next day's meal if not available)
      let secondCurry = null;

      const getCurries = (day, period) =>
        menu?.[day]?.[period]?.foods?.curry || [];

      let curries = getCurries(nextDay, nextPeriod);

      if (curries.length >= 2) {
        nextCurry = curries[0];
        secondCurry = curries[1];
      } else if (curries.length === 1) {
        nextCurry = curries[0];

        // 🕛 Get next meal after this one
        let secondDay = nextDay;
        let secondPeriod = nextPeriod === "lunch" ? "dinner" : "lunch";
        if (nextPeriod === "dinner") {
          const nextDayIndex = (days.indexOf(nextDay) + 1) % 7;
          secondDay = days[nextDayIndex];
        }

        const secondCurries = getCurries(secondDay, secondPeriod);
        if (secondCurries.length > 0) {
          secondCurry = secondCurries[0];
        }
      }

      // Set state (or combine into an array)
      setNextCurry({ first: nextCurry, second: secondCurry });
    } catch (err) {
      console.error("Error fetching menu", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 text-black pad_akm">
      <div className="space-y-2 ">
        {specialOrders.length > 0 && (
          <div className="p-3 space-y-2 border rounded-lg shadow bg-yellow-50 pad_akm">
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
                  <p className="text-lg font-bold">
                    {order.mrd_user_full_name} এর খাবার
                  </p>
                  <p className="flex flex-wrap gap-3 text-lg">
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

      <Card className="pad_akm">
        <CardBody className="flex items-center justify-center space-y-2 text-center">
          <h2 className="text-lg ">{date}</h2>
          <p className="text-2xl font-bold">{weekday}</p>
          <p className="text-xl "> {periodLabel}</p>
          <Divider className="my-4" />
          <div className="grid grid-cols-2 gap-2">
            {loading ? (
              <div className="flex items-center justify-center col-span-2 py-4 ">
                <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : Object.keys(foodCountMap).length === 0 ? (
              <div className="col-span-2 font-semibold text-center text-red-500">
                আপাতত কোন রান্না নেই
              </div>
            ) : (
              Object.entries(foodCountMap).map(([name, data], index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between gap-2 bg-white rounded-lg pad_akm"
                >
                  <div>
                    <img
                      src={`https://dalbhath.com/images/food/${data.img}`}
                      alt={name}
                      className="object-cover w-16 h-16 rounded-full"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{name}</span>
                    <Chip
                      size="lg"
                      variant="flat"
                      className="text-xl font-bold"
                    >
                      {toBanglaNumber(data.qty)}
                    </Chip>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
      <div>
        {nextCurry?.first && (
          <div className="text-center pad_akm h3_akm">
            পরের বেলা:{" "}
            <span className="font-bold">
              {nextCurry.first.food_name}
              {nextCurry.second && `, ${nextCurry.second.food_name}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KhalaToCook;
