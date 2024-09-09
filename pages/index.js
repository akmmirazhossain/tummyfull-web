// pages/index.js
import { useEffect } from "react"; // Import useEffect from React
import Layout from "./layout/Layout";
import Slider from "./layout/Slider";
import MenuComp from "./components/menu";

export default function Menu() {
  return (
    <>
      <Layout>
        {/* Puzzler */}
        <Slider />
        <MenuComp />
      </Layout>
    </>
  );
}
