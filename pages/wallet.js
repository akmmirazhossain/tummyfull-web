// pages/wallet.js
import React from "react";
import Layout from "./layout/Layout";
import WalletOptions from "./components/WalletOptions";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Head from "next/head";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return (
  //     <Layout>
  //       {/* <span className="loading loading-ring loading-md"></span> */}
  //     </Layout>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Wallet Recharge | Dalbhath.com</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="description"
          content="Recharge your Dalbhath wallet instantly using bKash and enjoy hassle-free meal orders."
        />

        <meta
          property="og:description"
          content="Recharge your Dalbhath wallet instantly using bKash and enjoy hassle-free meal orders."
        />

        <meta
          property="og:title"
          content="Recharge Your Dalbhath Wallet with bKash | Dalbhath.com"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/wallet" />

        <meta
          property="og:image"
          content="https://dalbhath.com/images/wallet.png"
        />
      </Head>
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
