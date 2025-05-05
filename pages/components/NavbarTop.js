import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import MealboxNavTop from "./MealboxNavTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faRightToBracket,
  faGear,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@nextui-org/react";
import Cookies from "js-cookie";

import { ApiContext } from "../contexts/ApiContext";
import { useUser } from "../contexts/UserContext";

const NavbarTop = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const { user, loading, error, isLoggedIn, refreshUser } = useUser();

  const apiConfig = useContext(ApiContext);
  // const token = Cookies.get("TFLoginToken");

  //AUTO REFRESH ON NEXT
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && apiConfig) {
      // Add apiConfig check

      refreshUser();
    }
  };

  useEffect(() => {
    // Add event listener when the component mounts
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup event listener when the component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [apiConfig]);

  // useEffect(() => {
  //   if (token) {
  //     if (!apiConfig) return;
  //     setIsLoggedIn(true);

  //     //MARK: Fetch User
  //     const fetchUser = async () => {
  //       setIsLoading(true);
  //       try {
  //         const response = await fetch(`${apiConfig.apiBaseUrl}user-fetch`, {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         const data = await response.json();
  //         setUserData(data.data.mrd_user_credit);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };
  //     fetchUser();
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [token, apiConfig]);

  // const handleLogout = () => {
  //   Cookies.remove("TFLoginToken"); // Remove the cookie
  //   setIsLoggedIn(false); // Update the state
  //   router.push("/"); // Redirect to the login page or home page
  // };

  const navbarItems = [
    {
      href: "/menu",
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
    <header className="bg_beige text-black shadow_akm">
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
            <Link
              color="foreground"
              href="/"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("menuRedir", "logo");
                }
              }}
            >
              <p className="font-niljannati text-2xl">ডালভাত.com</p>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 pr-6">
            {/* Replace with your menu items */}
            {navbarItems.map((item) => (
              <Link key={item.text} href={item.href}>
                <div className="gap-2  flex justify-center items-center">
                  <FontAwesomeIcon icon={item.icon} />
                  {item.text}
                </div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {!isLoggedIn && !loading && (
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
                <Link href="/wallet">
                  <Button
                    variant="light"
                    isIconOnly
                    size="lg"
                    className="text-green-600"
                    radius="full"
                  >
                    <div>
                      {loading ? (
                        <>
                          {/* <span className="loading loading-dots loading-xs"></span> */}
                        </>
                      ) : user.data.mrd_user_credit !== null ? (
                        `৳${user.data.mrd_user_credit}`
                      ) : (
                        "৳"
                      )}
                    </div>
                  </Button>
                </Link>

                <MealboxNavTop />
                <NotificationBell />

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
