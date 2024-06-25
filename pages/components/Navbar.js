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

export default function NavbarTop() {
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
          <p className=" font-budge text-2xl">TummyFull</p>
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
        <NavbarItem className="h-full flex">
          <Link
            href="/login"
            className="gap-2  flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faRightToBracket} />
            Login
          </Link>
        </NavbarItem>

        <NavbarItem className="h-full flex">
          <Link
            href="/logout"
            className="gap-2  flex justify-center items-center"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
