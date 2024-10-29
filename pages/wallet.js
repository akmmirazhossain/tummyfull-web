// pages/wallet.js
import React from "react";
import Layout from "./layout/Layout";
import WalletOptions from "./components/WalletOptions";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <span className="loading loading-ring loading-md"></span>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <WalletOptions />
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
