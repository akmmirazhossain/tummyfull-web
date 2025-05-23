import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faGear,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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
      href: "/menu",
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

    // {
    //   href: "https://wa.me/8801673692997?text=Hello%20I%20want%20to%20inquire%20about%20meals",
    //   icon: faWhatsapp,
    //   text: "Chat",
    // },
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
                  startContent={
                    <FontAwesomeIcon className="w-5 h-5" icon={item.icon} />
                  }
                  onClick={(event) => handleNavigation(item.href, event)}
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
