import { useState } from "react";
import { createLogger } from "../../../lib/logger";

export default function OrderSummery({
  day,
  mealPeriod,
  menuData,
  swappedFoodsData,
}) {
  const logger = createLogger("OrderSummery");

  const date = menuData[day].date;
  const orderId = menuData[day][mealPeriod].orderId;
  const orderQuantity = menuData[day][mealPeriod].orderQuantity;

  //FOOD PRICE SUM
  const foods = swappedFoodsData?.[day]?.[mealPeriod] || [];
  const totalPrice = foods.reduce((sum, f) => sum + (f.foodPrice || 0), 0);

  // logger.debug(totalPrice);

  //MARK: ORDER DETAILS
  const orderDetails = (day, date, orderId, mealPeriod, swappedFoodsData) => {
    // GOAL OF THIS BLOCK
    // SHOW the total price of meal, mealbox price, combined item price, delivery charge,
    // MEAL CALCULATIONS
    const singleMealPrice = menuData[day][mealPeriod].price;
    const mealQuantity = menuData[day][mealPeriod].quantity;
    const totalMealPrice = singleMealPrice * mealQuantity;
    const mealboxPrice = settings.settingMealboxPrice;
    const deliveryCharge = settings.mrd_setting_commission_delivery;
    const userCredit = user?.data?.mrd_user_credit;
    // USER DATA
    const userMealboxActive = user?.data?.mrd_user_mealbox;
    let mealboxOptions = false;
    let userHasMealbox = 0;
    let extraBoxes = 0;
    let extraBoxPrice = 0;
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

  return (
    <div>
      <div>Meal Price: ৳{totalPrice}</div>
      <div>Added mealbox:</div>
      <div>Delivery: </div>
      <div>Wallet Pay: </div>
      <div>Cash to Give: </div>

      <div>Delivery/Pick up time: </div>
      <div>Meal Price: </div>
    </div>
  );
}
