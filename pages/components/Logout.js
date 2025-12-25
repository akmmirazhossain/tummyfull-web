// pages/components/Logout.js
import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useUser } from "../contexts/UserContext";

const LogoutBlock = () => {
  const router = useRouter();
  const { user, loadingUser, error, isLoggedIn, refreshUser, loginToken } =
    useUser();

  const handleLogout = async () => {
    Cookies.remove("TFLoginToken"); // Remove the cookie
    window.location.href = "/menu";
  };

  return (
    <div>
      <div className="h1_akm">Logout</div>
      <div className="flex justify-end card_akm pad_akm">
        <Button onClick={handleLogout} size="lg">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default LogoutBlock;
