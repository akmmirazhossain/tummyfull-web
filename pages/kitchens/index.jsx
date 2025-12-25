// pages/kitchens/index.jsx

"use client";

//IMPORT CONSTANTS
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DUMMY_API = `${API_URL}/dummyapi`;

//IMPORT HOOKS
import React, { useState, useEffect } from "react";
import axios from "axios";

//IMPORT STORES
import { useKitchenStore } from "../../stores/kitchenStore";

//IMPORT UTILS

//CONSOLE LOG SWITCH
const log = 1 ? console.log : () => {};

//IMPORT COMPONENTS
import Layout from "../layout/Layout";
import LocationPicker from "../components/map/LocationPicker";

// import ChildComponent from "@/components/ChildComponent";

//IMPORT PACKAGES

//IMPORT UI
import { Button, Card } from "antd";
// import Spinner from "@/components/ui/Spinner";
// import TitleBar from "@/components/ui/TitleBar";

//IMPORT ICONS
import {} from "@ant-design/icons";

export default function PageTemplate() {
  //STATIC CONSTS
  // const sessionToken = useAuthStore((state) => state.sessionToken);
  // const toast = useToastStore();
  const { initNearbyKitchens, nearbyKitchens, loadingNearby } =
    useKitchenStore();

  //STATE VARS
  const [loadingPage, setLoadingPage] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  //INITIATE
  useEffect(() => {
    // Fetch kitchens only when user location is available
    if (userLocation?.lat && userLocation?.lon) {
      initNearbyKitchens(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  //FUNCTIONS
  const handleLocationSelect = (locationData) => {
    log("User location received:", locationData);
    setUserLocation(locationData);
    // Kitchen fetch will trigger automatically via useEffect
  };

  //API CALLS
  async function fetchApiData() {
    try {
      const response = await axios.get(DUMMY_API, {
        headers: {
          Authorization: `Bearer sessionToken`,
        },
      });

      setFetchedData(response.data);

      //SET LOADING FALSE
      setLoadingPage(false);
      //SHOW LOG SUCCESS
      log("inside fetchApiData");

      //SHOW TOAST SUCCESS
      toast.success("fetchApiData Success");
    } catch (error) {
      //SHOW LOG SUCCESS
      log("inside fetchApiData error", error);

      //SHOW TOAST ERROR
      toast.error("An error occured");

      //SET LOADING FALSE
      setLoadingPage(false);
    }
  }

  //MAIN DATA DISPLAY
  return (
    <Layout>
      {/* <TitleBar text="Page Template" /> */}

      <LocationPicker onLocationSelect={handleLocationSelect} />
      <div className="mb_akm">
        {" "}
        <div className="h3_akm py_akm">Cuisines</div>
        <div className="grid grid-cols-4 gap_akm">
          {" "}
          <div className="border border-red-500">Bangladeshi</div>
          <div className="border border-blue-500">Chinese</div>
          <div className="border border-green-500">Thai</div>
          <div className="border border-yellow-500">Indian</div>
        </div>
      </div>

      <div>
        <div className="h3_akm py_akm">Kitchens</div>

        {loadingNearby ? (
          <div>Loading kitchens...</div>
        ) : nearbyKitchens.length > 0 ? (
          <div className="grid grid-cols-4 gap_akm">
            {nearbyKitchens.map((kitchen) => (
              <div
                key={kitchen.kitchenId}
                className="border border-blue-500 p_akm"
              >
                <div className="font-bold">{kitchen.kitchenName}</div>
                <div>Rating: {kitchen.kitchenRating}</div>
                <div>Distance: {kitchen.kitchenDistance} km</div>
                <div>Delivery: ৳{kitchen.kitchenDeliveryCharge}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No kitchens found in your area</div>
        )}
      </div>
      {loadingPage ? (
        <div>
          {/* <Spinner color="blue" size="large" text="Loading page..." /> */}
        </div>
      ) : (
        <div>
          {fetchedData ? JSON.stringify(fetchedData, null, 2) : "No data found"}
        </div>
      )}
      {/* 
      <ChildComponent childFunction={handleChildAction} /> */}
    </Layout>
  );
}
