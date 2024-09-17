//components/NotificationBell.js

import React, { useRef, useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Badge, Button } from "@nextui-org/react";
import Link from "next/link";
import { useNotification } from "../contexts/NotificationContext";
import Cookies from "js-cookie";
import axios from "axios";
import { ApiContext } from "../contexts/ApiContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

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

  const [showNotifications, setShowNotifications] = useState(false);
  const [notif, setNotif] = useState(null);

  const [unseenCount, setUnseenCount] = useState(0);
  const notificationRef = useRef(null);
  const apiConfig = useContext(ApiContext);
  const token = Cookies.get("TFLoginToken");

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

  //CLOSE POP ON OUTSIDE MOUSE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        // fetchNotif();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBellClick = async () => {
    setShowNotifications((prev) => !prev);

    //MARK: Notif seen
    if (!showNotifications) {
      try {
        await axios.get(`${apiConfig.apiBaseUrl}notif-seen`, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Error updating notifications:", error);
      }
    }

    setUnseenCount(0);
  };

  return (
    <div className="flex items-center justify-center">
      <div id="notif_bell" className=" relative" ref={notificationRef}>
        <Badge
          color="danger"
          content={unseenCount}
          size="md"
          shape="circle"
          isInvisible={unseenCount === 0}
        >
          <Button
            radius="full"
            isIconOnly
            variant="light"
            onClick={handleBellClick}
            size="sm"
          >
            <FontAwesomeIcon
              className={`font-awesome-icon cursor-pointer  text-lg ${
                isShaking ? "shake_bell" : ""
              }`}
              icon={faBell}
              size="2x"
            />
          </Button>
        </Badge>

        {showNotifications && notif && notif.notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-64 md:w-96 bg-white border border-gray-300 rounded-md shadow-lg z-20 ">
            {notif.notifications.slice(0, 5).map((notification, index) => (
              <div
                key={index}
                className="text-sm  border-b last:border-0 p-2 md:p-3"
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
                <div className="flex gap_akm">
                  {notification.mrd_notif_quantity && (
                    <p className="text-xs">
                      Quantity: {notification.mrd_notif_quantity}{" "}
                    </p>
                  )}
                  {notification.mrd_notif_total_price && (
                    <p className="text-xs">
                      Total: ৳{notification.mrd_notif_total_price}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <Link href={"/notification"}>
              <div className="h4info_akm  text-center pad_akm">
                Show all notifications
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
