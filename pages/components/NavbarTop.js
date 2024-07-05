import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faRightToBracket,
  faRightFromBracket,
  faGear,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const NavbarTop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("TFLoginToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logout button tiggered");
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

    {
      href: "/mealbook",
      icon: faListCheck,
      text: "Meal Book",
    },
    {
      href: "/settings",
      icon: faGear,
      text: "Settings",
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
              <Link
                onClick={handleLogout}
                href="/"
                className="gap-2 flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarTop;
