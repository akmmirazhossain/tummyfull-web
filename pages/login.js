// pages/index.js
import React from "react";
import Layout from "./layout/Layout";
import LoginForm from "./components/LoginForm";

export default function Menu() {
  return (
    <>
      <Layout title="Login - ডালভাত">
        <LoginForm />
      </Layout>
    </>
  );
}
