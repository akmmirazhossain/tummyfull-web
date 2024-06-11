import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import LogoutButton from "./LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faUser,
  faWallet,
  faRightToBracket,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function NavbarTop() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loggedIn); // Set isLoggedIn to true if loggedIn is not null
  }, []);
  return (
    <Navbar isBlurred={false}>
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
        <NavbarItem className="h-full flex justify-center  ">
          <Link color="foreground" href="/" className="gap-2">
            <FontAwesomeIcon icon={faUtensils} />
            Menu
          </Link>
        </NavbarItem>

        <NavbarItem className="h-full flex justify-center  ">
          <Link color="foreground" href="/profile" className="gap-2">
            <FontAwesomeIcon icon={faUser} />
            Profile
          </Link>
        </NavbarItem>

        <NavbarItem className="h-full flex justify-center  ">
          <Link color="foreground" href="#" className="gap-2">
            <FontAwesomeIcon icon={faWallet} />
            Wallet
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/login" color="foreground">
            <FontAwesomeIcon icon={faRightToBracket} />
            Login
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link href="/login" color="foreground">
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
