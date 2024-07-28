import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faRightToBracket,
  faRightFromBracket,
  faGear,
  faListCheck,
  faWallet,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner } from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { ApiContext } from "../contexts/ApiContext";

const NavbarTop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const apiConfig = useContext(ApiContext);
  const token = Cookies.get("TFLoginToken");

  useEffect(() => {
    if (token && apiConfig) {
      setIsLoggedIn(true);
      const fetchData = async () => {
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
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [token, apiConfig]);

  const handleLogout = () => {
    Cookies.remove("TFLoginToken"); // Remove the cookie
    setIsLoggedIn(false); // Update the state
    router.push("/"); // Redirect to the login page or home page
  };

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
    {
      href: "/notification",
      icon: faBell,
      text: "Notifications",
    },
  ];

  return (
    <header className="bg_beige text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center py-2  ">
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
          <div>
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
              <div className="flex items-center justify-center gap-2">
                <Link href="/wallet">
                  <Button color="primary" variant="light" radius="full">
                    <div>
                      {isLoading ? (
                        <Spinner size="sm" />
                      ) : userData !== null ? (
                        `৳${userData}`
                      ) : (
                        "Couldnt load credit"
                      )}
                    </div>
                  </Button>
                </Link>

                <Link
                  onClick={handleLogout}
                  href="/"
                  className="gap-2 flex justify-center items-center"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarTop;
