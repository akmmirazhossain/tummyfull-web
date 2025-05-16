//components/NotificationBell.js

import React, { useRef, useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import { useNotification } from "../contexts/NotificationContext";
import Cookies from "js-cookie";
import axios from "axios";
import { ApiContext } from "../contexts/ApiContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import FeedbackModal from "./FeedbackModal";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const formatNotificationDate = (date) => {
  const dayjsDate = dayjs(date);
  const now = dayjs();
  return now.diff(dayjsDate, "day") < 2
    ? dayjsDate.fromNow()
    : dayjsDate.format("ddd, Do MMM");
};

const NotificationBell = () => {
  const { isShaking, notifLoad, setNotifLoad } = useNotification();

  // const [showNotifications, setShowNotifications] = useState(false);
  const [notif, setNotif] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const [unseenCount, setUnseenCount] = useState(0);
  const notificationRef = useRef(null);

  const apiConfig = useContext(ApiContext);
  const token = Cookies.get("TFLoginToken");
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    orderId: null,
    dateAdded: null,
    message: null,
  });

  // const [updateNotif, setUpdateNotif] = useState(false);

  const fetchNotif = async () => {
    if (token && apiConfig) {
      try {
        const response = await axios.get(`${apiConfig.apiBaseUrl}notif-get`, {
          headers: { Authorization: token },
        });
        // alert("Notif Fetched");
        const notifications = response.data.notifications;
        const unseen = notifications.filter(
          (notif) => notif.mrd_notif_seen === 0
        ).length;

        setNotif(response.data);
        setUnseenCount(unseen);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    if (token && apiConfig) {
      fetchNotif(); // Fetch notifications initially
    }
  }, [token, apiConfig]);

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        fetchNotif(); // Fetch notifications when isShaking is true
      }, 100); // Slight delay to handle state batching issues on iOS

      return () => clearTimeout(timer); // Cleanup timeout on component unmount or dependency change
    }
  }, [isShaking]);

  // components/NotificationBell.js

  useEffect(() => {
    if (notifLoad) {
      fetchNotif().then(() => {
        // Reset notifLoad to false after fetching notifications
        setNotifLoad(false); // This will ensure it can be triggered again
      });
    }
  }, [notifLoad]);

  const handleBellClick = async () => {
    setUnseenCount(0);
    console.log("🚀 ~ handleBellClick ~ handleBellClicked");
    // setShowNotifications((prev) => !prev);

    //MARK: Notif seen
    try {
      await axios.get(`${apiConfig.apiBaseUrl}notif-seen`, {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  return (
    <>
      <Popover
        id="notif_bell"
        offset={10}
        placement="bottom"
        isOpen={notifOpen}
        onOpenChange={(open) => {
          setNotifOpen(open);
          if (open) {
            setTimeout(() => {
              handleBellClick();
            }, 200);
          }
        }}
      >
        <PopoverTrigger>
          <Button
            radius="full"
            isIconOnly
            variant="light"
            size="lg"
            className="relative"
          >
            <Badge
              badgeContent={unseenCount}
              invisible={unseenCount === 0}
              color="error"
            >
              <FontAwesomeIcon
                className={`text_black font-awesome-icon cursor-pointer  text-lg ${
                  isShaking ? "shake_bell" : ""
                }`}
                icon={faBell}
                size="2x"
              />
            </Badge>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex justify-start items-start text_black text-left max-w-80 min-w-72">
          {notif && notif.notifications.length > 0 ? (
            <div className="">
              {notif.notifications.slice(0, 5).map((notification, index) => (
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
                    {notification.mrd_notif_type == "order" &&
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

                    {notification.mrd_notif_type == "order" &&
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
              {notif.notifications.length > 5 && (
                <Link href={"/notification"}>
                  <div className="h4info_akm text-center pad_akm">
                    Show all notifications
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-3">
              You have no notifications yet.
            </div>
          )}
        </PopoverContent>
      </Popover>
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
    </>
  );
};

export default NotificationBell;
