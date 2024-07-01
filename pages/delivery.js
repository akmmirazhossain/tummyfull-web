// pages/index.js
import Layout from "./layout/Layout";
import OrderList from "./components/ChefToCookNow";
import MealList from "./components/ChefToCookLater";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Menu() {
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
        <div className="text-2xl border-b-2">Chef page</div>
        <OrderList />
        <MealList />
      </Layout>
    </>
  );
}
