// pages/index.js
import Layout from "./layout/Layout";
import OrderList from "./components/ChefToCookNow";
import MealList from "./components/ChefToCookLater";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function chef() {
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
        <div className="h1_akm ">Chef Panel</div>
        <OrderList />
        {/* <MealList /> */}
      </Layout>
    </>
  );
}
