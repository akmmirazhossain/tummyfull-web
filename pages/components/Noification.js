import { ApiContext } from "../contexts/ApiContext";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import FeedbackModal from "./FeedbackModal";

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
  const apiConfig = useContext(ApiContext);
  const [notif, setNotif] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    orderId: null,
    dateAdded: null,
    message: null,
  });

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
        <div className="min-h-screen p-8 space-y-3 card_akm">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="h-4 rounded-lg" />
          ))}
        </div>
      </>
    ); // Add loading indicator

  if (loading)
    return (
      <>
        <div className="h1_akm ">Notifications</div>
        <div className="min-h-screen p-8 space-y-3 card_akm">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="h-4 rounded-lg" />
          ))}
        </div>
      </>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="h1_akm ">Notifications</div>
      <div className="min-h-screen p-8 card_akm">
        {notif && notif.notifications && notif.notifications.length > 0 ? (
          <>
            {notif.notifications.map((notification, index) => (
              <div
                key={index}
                className="flex flex-col gap-0.5 text-sm border-b last:border-0 p-2 md:p-3"
              >
                <p
                  className={`${
                    notification.mrd_notif_seen === 0
                      ? "font-bold"
                      : "font-normal"
                  }`}
                >
                  {notification.mrd_notif_message}
                </p>
                <p className="text-xs text-gray-500">
                  {formatNotificationDate(notification.mrd_notif_date_added)}
                </p>
                <div className="flex items-center gap_akm">
                  {notification.mrd_notif_category == "order" &&
                    notification.mrd_notif_action == "payment" && (
                      <Link href={"/wallet"}>
                        <p className="text-xs">Recharge wallet</p>
                      </Link>
                    )}
                  {notification.mrd_notif_quantity && (
                    <p className="text-xs">
                      Qty: {notification.mrd_notif_quantity}
                    </p>
                  )}

                  {notification.mrd_notif_mealbox_extra !== 0 &&
                    notification.mrd_notif_mealbox_extra !== null && (
                      <p className="text-xs">
                        Added Mealbox: {notification.mrd_notif_mealbox_extra}
                      </p>
                    )}

                  {notification.mrd_notif_total_price && (
                    <p className="text-xs">
                      Total: ৳{notification.mrd_notif_total_price}
                    </p>
                  )}

                  {notification.mrd_notif_category == "order" &&
                    notification.mrd_notif_action == "delivery" && (
                      <FontAwesomeIcon
                        onClick={() => {
                          setNotifOpen(false);
                          setFeedbackModal({
                            isOpen: true,
                            orderId: notification.mrd_notif_order_id,
                            dateAdded: notification.mrd_notif_date_added,
                            message: notification.mrd_notif_message,
                          });
                        }}
                        className="cursor-pointer relative -top-0.5 transition duration-150 ease-in-out hover:scale-110 hover:text-yellow-500 active:scale-95 focus:outline-none focus:ring focus:ring-yellow-400"
                        icon={faStar}
                      />
                    )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No notifications found.</p>
        )}

        <FeedbackModal
          isOpen={feedbackModal.isOpen}
          orderId={feedbackModal.orderId}
          dateAdded={feedbackModal.dateAdded}
          message={feedbackModal.message}
          onClose={() =>
            setFeedbackModal({
              isOpen: false,
              orderId: null,
              dateAdded: null,
              message: null,
            })
          }
        />
      </div>
    </div>
  );
};

export default Notification;
