// pages/settings.js
import React from "react";
import Layout from "./layout/Layout";
import ProfileForm from "./components/ProfileForm";
import MealSettings from "./components/MealSettings";
import LogoutBlock from "./components/Logout";

export default function Settings() {
  return (
    <Layout>
      <ProfileForm />
      <MealSettings />
      <LogoutBlock />
    </Layout>
  );
}
