import { ApiContext } from "../contexts/ApiContext";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
// import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@nextui-org/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const formatNotificationDate = (date) => {
  const dayjsDate = dayjs(date);
  const now = dayjs();

  if (now.diff(dayjsDate, "day") < 2) {
    // Show "Just now", "Yesterday", etc.
    return dayjsDate.fromNow();
  } else {
    // Show "Monday, 2nd Sep"
    return dayjsDate.format("ddd, Do MMM");
  }
};

const Notification = () => {
  const router = useRouter();
  const apiConfig = useContext(ApiContext);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("TFLoginToken");
      try {
        const response = await axios.get(`${apiConfig.apiBaseUrl}notif-get`, {
          headers: {
            Authorization: token,
          },
        });

        console.log("🚀 ~ fetchData ~ response:", response.data);
        setNotif(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (apiConfig) {
      fetchData();
    }
  }, [apiConfig]);

  if (!apiConfig)
    return (
      <>
        <div className="h1_akm ">Notifications</div>
        <div className="card_akm   p-8 min-h-screen  space-y-3">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="rounded-lg h-4" />
          ))}
        </div>
      </>
    ); // Add loading indicator

  if (loading)
    return (
      <>
        <div className="h1_akm ">Notifications</div>
        <div className="card_akm   p-8 min-h-screen  space-y-3">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="rounded-lg h-4" />
          ))}
        </div>
      </>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="h1_akm ">Notifications</div>
      <div className="card_akm p-8 min-h-screen">
        {notif && notif.notifications && notif.notifications.length > 0 ? (
          <>
            {notif.notifications.map((notification, index) => (
              <div className="grid grid-cols-5 " key={index}>
                <div className="col-span-2 flex items-center mb-3">
                  {notification.mrd_notif_message}
                </div>
                <div className="flex items-center mb-3">
                  {notification.mrd_notif_quantity !== null &&
                    `Qty: ${notification.mrd_notif_quantity}`}
                </div>
                <div className="flex items-center mb-3">
                  {notification.mrd_notif_total_price !== null &&
                    `৳ ${notification.mrd_notif_total_price}`}
                </div>
                <div className="h4info_akm flex justify-end mb-3">
                  {formatNotificationDate(notification.mrd_notif_date_added)}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default Notification;
