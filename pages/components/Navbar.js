import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import LogoutButton from "./LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faUser,
  faBell,
  faRightToBracket,
  faRightFromBracket,
  faGear,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import the router

export default function NavbarTop() {
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
    <Navbar className="text-gray-800 bg_beige" isBlurred={false}>
      <NavbarBrand>
        <Image
          className="mr-1"
          width={50}
          height={50}
          src="/logo.png"
          alt={"logo"}
        />
        <Link color="foreground" href="./">
          <p className=" font-niljannati text-2xl">খেয়েছ?</p>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-6 font-medium"
        justify="center"
      >
        {navbarItems.map((item, index) => (
          <NavbarItem key={index} className="h-full flex ">
            <Link
              href={item.href}
              className="gap-2  flex justify-center items-center"
            >
              <FontAwesomeIcon icon={item.icon} />
              {item.text}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {!isLoggedIn && (
          <NavbarItem className="h-full flex">
            <Link
              href="/login"
              className="gap-2  flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faRightToBracket} />
              Login
            </Link>
          </NavbarItem>
        )}

        {isLoggedIn && (
          <NavbarItem className="h-full flex">
            <Link
              onClick={handleLogout}
              href="/"
              className="gap-2 flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              Logout
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
