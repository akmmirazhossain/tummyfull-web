import React from "react";
import { useRouter } from "next/router";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login status
    router.push("/index"); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
