import React, { useEffect, useState, useContext, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faRightToBracket,
  faRightFromBracket,
  faGear,
  faListCheck,
  faWallet,
  faEllipsisVertical,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner, Badge } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import { ApiContext } from "../contexts/ApiContext";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import advancedFormat from "dayjs/plugin/advancedFormat";

// dayjs.extend(relativeTime);
// dayjs.extend(advancedFormat);

// const formatNotificationDate = (date) => {
//   const dayjsDate = dayjs(date);
//   const now = dayjs();

//   if (now.diff(dayjsDate, "day") < 2) {
//     // Show "Just now", "Yesterday", etc.
//     return dayjsDate.fromNow();
//   } else {
//     // Show "Monday, 2nd Sep"
//     return dayjsDate.format("ddd, Do MMM");
//   }
// };

const NavbarTop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const apiConfig = useContext(ApiContext);
  const token = Cookies.get("TFLoginToken");

  useEffect(() => {
    if (token) {
      if (!apiConfig) return;
      setIsLoggedIn(true);

      //MARK: Fetch User
      const fetchUser = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${apiConfig.apiBaseUrl}user-fetch`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          setUserData(data.data.mrd_user_credit);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token, apiConfig]);

  // const handleLogout = () => {
  //   Cookies.remove("TFLoginToken"); // Remove the cookie
  //   setIsLoggedIn(false); // Update the state
  //   router.push("/"); // Redirect to the login page or home page
  // };

  const navbarItems = [
    {
      href: "/",
      icon: faUtensils,
      text: "Menu",
    },

    // {
    //   href: "/mealbook",
    //   icon: faListCheck,
    //   text: "Meal Book",
    // },
    {
      href: "/settings",
      icon: faGear,
      text: "Settings",
    },

    // {
    //   href: "/wallet",
    //   icon: faWallet,
    //   text: "Wallet",
    // },
    // {
    //   href: "/notification",
    //   icon: faBell,
    //   text: "Notifications",
    // },

    {
      href: "/info",
      icon: faEllipsisVertical,
      text: "More",
    },
  ];

  return (
    <header className="bg_beige text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center py-2  ">
          {/* Puzzler */}
          <div className="flex justify-start items-center ">
            <Image
              className="mr-1"
              width={50}
              height={50}
              src="/logo.png"
              alt={"logo"}
            />
            <Link color="foreground" href="./">
              <p className=" font-niljannati text-2xl">ডালভাত.com</p>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 pr-6">
            {/* Replace with your menu items */}
            {navbarItems.map((item, index) => (
              <Link
                key={item.text}
                href={item.href}
                className="gap-2  flex justify-center items-center"
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.text}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {!isLoggedIn && (
              <Link
                href="/login"
                className="gap-2  flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </Link>
            )}

            {isLoggedIn && (
              <div className="flex items-center justify-center ">
                <NotificationBell />
                <Link href="/wallet">
                  <Button
                    variant="light"
                    isIconOnly
                    size="lg"
                    className="text-green-600"
                  >
                    <div>
                      {isLoading ? (
                        <Spinner size="sm" />
                      ) : userData !== null ? (
                        `৳${userData}`
                      ) : (
                        "৳"
                      )}
                    </div>
                  </Button>
                </Link>

                {/* <Link
                  onClick={handleLogout}
                  href="/"
                  className="gap-2 flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarTop;
