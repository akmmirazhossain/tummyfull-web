// pages/index.js
import React from "react";
import Layout from "./layout/Layout";
import Slider from "./layout/Slider";
import MenuComp from "./components/menu";

export default function Menu() {
  return (
    <>
      <Layout>
        <Slider />
        <MenuComp />
      </Layout>
    </>
  );
}
