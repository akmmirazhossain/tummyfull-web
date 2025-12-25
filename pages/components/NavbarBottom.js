import React from "react";

import { useRouter } from "next/router";

const NavbarBottom = () => {
  const router = useRouter();

  // Handle navigation with delay to allow ripple effect
  const handleNavigation = (href) => {
    setTimeout(() => {
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
    <header className="fixed bottom-0 z-20 w-full text-black bg_beige md:hidden">
      <div className="max-w-5xl mx-auto ">
        <div className="flex items-center justify-center ">
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
                  onPress={() => handleNavigation(item.href)}
                >
                  {item.text}
                </Button>
              ))}
            </ButtonGroup>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavbarBottom;
