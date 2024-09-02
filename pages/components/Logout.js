// ./components/LoginForm.js
import React, { useState, useEffect, useMemo } from "react";
import { Input, Spacer, Button as ModalButton } from "@nextui-org/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@nextui-org/react";

const LogoutBlock = () => {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("TFLoginToken"); // Remove the cookie
    // setIsLoggedIn(false); // Update the state
    router.push("/"); // Redirect to the login page or home page
  };
  return (
    <div>
      <div className="h1_akm">Logout</div>
      <div className="card_akm pad_akm flex justify-end">
        {" "}
        <Button onClick={handleLogout} size="lg">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default LogoutBlock; // Making LoginForm the default export
