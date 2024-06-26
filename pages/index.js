// pages/index.js
import { useEffect } from "react"; // Import useEffect from React
import Layout from "./layout/Layout";
import MenuComp from "./components/menu2";

export default function Menu() {
  return (
    <>
      <Layout>
        <MenuComp />
      </Layout>
    </>
  );
}
