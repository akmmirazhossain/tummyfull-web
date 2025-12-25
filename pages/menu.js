// pages/menu.js
import React, { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import MenuComp from "./components/menuComp";
import Head from "next/head";

//IMPORT COMPONENTS
import Kitchens from "./components/kitchens/Kitchens";
import LocationPicker from "./components/map/LocationPicker";

//CONSOLE LOG SWITCH
const log = 1 ? console.log : () => {};

export default function Menu() {
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [refreshMenu, setRefreshMenu] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    console.log("User location received:", locationData);
    setUserLocation(locationData);
  };

  return (
    <>
      <Head>
        <title>Weekly Menu - Customize Your Meals | Dalbhath.com</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Browse this week's menu and customize your meals to fit your taste."
        />
        <meta
          property="og:description"
          content="Browse this week's menu and customize your meals to fit your taste."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/menu" />
        <meta
          property="og:title"
          content="Weekly Menu - Customize Your Meals | dalbhath.com"
        />
        <meta
          property="og:image"
          content="https://dalbhath.com/images/premium_quality.png"
        />
      </Head>
      <Layout>
        <LocationPicker onLocationSelect={handleLocationSelect} />

        {userLocation && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              margin: "10px 0",
            }}
          >
            <p>
              <strong>Address:</strong> {userLocation.address}
            </p>
            <p>
              <strong>Coordinates:</strong> {userLocation.lat},{" "}
              {userLocation.lon}
            </p>
          </div>
        )}
        {/* <Kitchens
          setRefreshMenu={setRefreshMenu}
          onKitchenSelect={setSelectedKitchen}
        />
        <MenuComp
          selectedKitchen={selectedKitchen}
          refreshMenu={refreshMenu}
          setRefreshMenu={setRefreshMenu}
        /> */}
      </Layout>
    </>
  );
}
