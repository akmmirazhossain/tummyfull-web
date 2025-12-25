// pages/index.js
import React from "react";
import Layout from "./layout/Layout";
import LoginForm from "./components/LoginForm";
import Slider from "./layout/Slider";

export default function Menu() {
  return (
    <>
      <Layout title="Login - ডালভাত">
        <Slider />
        <LoginForm />
      </Layout>
    </>
  );
}
