import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
import MealboxNavTop from "./MealboxNavTop";

import { ApiContext } from "../contexts/ApiContext";
// import { useUser } from "../contexts/UserContext";
import WalletCredit from "./WalletCredit";

const NavbarTop = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userData, setUserData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const { user, loading, error, isLoggedIn, refreshUser } = useUser();

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
    <header className="text-black bg_beige shadow_akm">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-6">
        <div className="flex items-center justify-between py-2 ">
          {/* Puzzler */}
          <div className="flex items-center justify-start ">
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
              <p className="text-2xl font-niljannati">ডালভাত.com</p>
            </Link>
          </div>
          <nav className="hidden pr-6 space-x-6 md:flex">
            {/* Replace with your menu items */}
            {navbarItems.map((item) => (
              <Link key={item.text} href={item.href}>
                <div className="flex items-center justify-center gap-2">
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
                className="flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faRightToBracket} />
                Login
              </Link>
            )}

            {isLoggedIn && (
              <div className="flex items-center justify-center ">
                <Link href="/wallet">
                  <Button variant="light" isIconOnly size="lg" radius="full">
                    <WalletCredit />
                  </Button>
                </Link>

                <MealboxNavTop />
                <NotificationBell />
                {/* <Link
                  onClick={handleLogout}
                  href="/"
                  className="flex items-center justify-center gap-2"
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
