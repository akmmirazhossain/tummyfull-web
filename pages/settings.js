// pages/settings.js
import React from "react";
import Layout from "./layout/Layout";
import { Skeleton } from "@nextui-org/react";
import ProfileForm from "./components/ProfileForm";
import MealSettings from "./components/MealSettings";
import LogoutBlock from "./components/Logout";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className=" mt_akm pt_akm">
          <Skeleton className="rounded-lg w-60 h-12 mb_akm" />
          <div className="card_akm pad_akm ">
            {" "}
            <Skeleton className="rounded-lg h-12 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-12 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-20 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-28 w-96 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-12 w-24 my_akm mx_akm" />
          </div>
        </div>

        <div className=" mt_akm pt_akm">
          <Skeleton className="rounded-lg w-60 h-12 mb_akm" />
          <div className="card_akm pad_akm ">
            {" "}
            <Skeleton className="rounded-lg h-12 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-12 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-20 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-28 w-96 my_akm mx_akm" />
            <Skeleton className="rounded-lg h-12 w-24 my_akm mx_akm" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout title="Settings - ডালভাত">
        <ProfileForm />
        <div id="mealbox">
          {" "}
          <MealSettings />
        </div>

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
