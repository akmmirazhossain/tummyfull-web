// pages/settings.js
import React from "react";
import Layout from "./layout/Layout";
import ProfileForm from "./components/ProfileForm";
import MealSettings from "./components/MealSettings";
import LogoutBlock from "./components/Logout";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Layout>Loading...</Layout>;
  }

  return (
    <>
      <Layout>
        <ProfileForm />
        <MealSettings />
        <LogoutBlock />
      </Layout>
    </>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <ProtectedPage />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
