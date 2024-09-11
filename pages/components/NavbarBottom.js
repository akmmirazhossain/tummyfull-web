import React, { useEffect, useState } from "react";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faGear,
  faBell,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Button, ButtonGroup } from "@nextui-org/react";

const NavbarBottom = () => {
  // useEffect(() => {
  //   const token = Cookies.get("TFLoginToken");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const router = useRouter();

  // Handle click event, preserving the button's native effects
  const handleNavigation = (href, event) => {
    event.preventDefault(); // Prevent default link behavior
    setTimeout(() => {
      // Delay navigation to allow ripple effect
      router.push(href);
    }, 300); // Adjust delay as needed
  };

  const navbarItems = [
    {
      href: "/",
      icon: faUtensils,
      text: "Menu",
    },

    {
      href: "/settings",
      icon: faGear,
      text: "Settings",
    },
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
    <header className="bg_beige text-black md:hidden fixed w-full z-20  bottom-0">
      <div className="max-w-5xl mx-auto  ">
        <div className="flex justify-center items-center  ">
          <nav className="flex items-center justify-center ">
            <ButtonGroup>
              {navbarItems.map((item, index) => (
                <Button
                  className="py-8"
                  key={index}
                  variant="light"
                  radius="none"
                  startContent={<FontAwesomeIcon icon={item.icon} />}
                  onClick={(event) => handleNavigation(item.href, event)} // Navigate to the corresponding route
                >
                  {item.text}
                </Button>
              ))}
            </ButtonGroup>

            {/* {navbarItems.map((item, index) => (
              <Link
                href={item.href}
                className=" gap-2 py-6 px-6 flex justify-center items-center"
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.text}
              </Link>
            ))} */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavbarBottom;
