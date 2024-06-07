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

export default function NavbarTop() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(!!loggedIn); // Set isLoggedIn to true if loggedIn is not null
  }, []);
  return (
    <Navbar>
      <NavbarBrand>
        <Link color="foreground" href="./">
          <p className="font-bold text-inherit">TummyFull</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Menu
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link color="foreground" href="#">
            Areas
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            How it works?
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {!isLoggedIn ? (
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              <LogoutButton />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
