import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "./ui/Snackbar";

export default function MealPeriodPopover({
  mealDay,
  mealDayShort,
  mealPeriod,
  quantity,
  LoginToken,
  onAutoOrderChange,
  menuId,
  date,
}) {
  const { showSnackbar } = useSnackbar();

  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mealDayShort || !mealType) return;

    if (!LoginToken) {
      setLoading(false);
      return;
    }

    //MARK: MEAL AUTO STAT
    const fetchAutoOrderStatus = async () => {
      console.log("TRIGGERED: autoOrderStatus");
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/order/auto/status`,
          {
            params: { mealDayShort, mealType },
            headers: { Authorization: `Bearer ${LoginToken}` },
          }
        );
        if (response.data.active === 1) {
          setIsActive(true);
        }
        console.log("FETCH: AutoOrderStatus :", response.data.active);
      } catch (error) {
        console.error("Error checking auto order:", error);
        setIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAutoOrderStatus();
  }, [mealDayShort, mealType, LoginToken]);

  //MARK: MEAL AUTO ACT
  const toggleAutoOrder = async (status) => {
    if (!LoginToken) {
      showSnackbar("Please login to cutomize meals", "info");
      return;
    }

    if (loading) return;
    setIsActive(status);
    console.log("TRIGGERED -> activator: Status-", status);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/auto/activator`,
        {
          mealDay,
          mealDayShort,
          mealType,
          quantity,
          status,
          menuId,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${LoginToken}`,
          },
        }
      );
      console.log("🚀 ~ toggleAutoOrder ~ response:", response.data);

      if (!response.data.success) {
        showSnackbar(response.data.message, response.data.type);
        setIsActive(false);
        return;
      }

      setIsActive(status);

      //EXECUTE THE MENU PAGE'S FUNCTION
      if (onAutoOrderChange) {
        onAutoOrderChange(status);
      }

      showSnackbar(
        `Auto-order ${
          status ? "enabled" : "disabled"
        } for all upcoming ${mealDay}'s ${mealType}`,
        status ? "success" : "info"
      );
    } catch (error) {
      console.error("Error toggling auto order:", error);
      // Optionally show an error snackbar here
    }
  };

  return (
    <div className="flex items-center justify-center w-80 pad_akm gap_akm text_black ">
      <div className="w-4/5">
        {loading ? (
          <Skeleton className="h-5 rounded_akm " />
        ) : (
          <div>
            Auto-order all upcoming {mealDay}'s {mealType}
          </div>
        )}
      </div>

      <div className="w-1/5">
        {loading ? (
          <Skeleton className="h-6  rounded_akm" />
        ) : (
          <Switch
            aria-label="Automatic updates"
            color="success"
            isSelected={isActive}
            onValueChange={toggleAutoOrder}
          />
        )}
      </div>
    </div>
  );
}
