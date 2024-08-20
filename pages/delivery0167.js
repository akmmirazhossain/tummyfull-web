// pages/index.js
import Layout from "./layout/Layout";
import Deliveries from "./components/DeliverySchedule";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();
  useEffect(() => {
    checkAndRedirect();
  }, []);

  const checkAndRedirect = () => {
    const token = Cookies.get("TFLoginToken");
    if (!token) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    } else {
      //return cookies.TFLoginToken;
      console.log("MealSettings: checkAndRedirect -> Token found");
    }
  };
  return (
    <>
      <Layout>
        <Deliveries />
      </Layout>
    </>
  );
}
