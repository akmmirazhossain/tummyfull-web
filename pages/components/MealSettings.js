// components/GeneralSettings.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import {
  Image,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";

const MealSettings = () => {
  const [isOn, setIsOn] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const router = useRouter();

  const [config, setConfig] = useState(null);
  const { shakeBell, notifLoadTrigger } = useNotification();

  useEffect(() => {
    checkAndRedirect();
    // Fetch config.json on component mount
    const fetchConfig = async () => {
      try {
        const response = await fetch("../../config.json"); // Adjust URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    //MARK: FETCH USER
    const fetchUserData = async () => {
      if (!config) return; // Exit early if config is not yet fetched

      const { apiBaseUrl } = config;
      const token = Cookies.get("TFLoginToken");

      try {
        const response = await axios.get(`${apiBaseUrl}user-fetch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const mealboxStatus = response.data.data.mrd_user_mealbox;

        //console.log(isOn);
        // console.log("Phone:", response.data.data.phone);
        setIsOn(mealboxStatus);
      } catch (error) {
        console.error("fetchUserData -> API Error:", error);
      }
    };

    fetchUserData();
  }, [config]);

  //REDIRECT IF NOT LOGGED IN
  const checkAndRedirect = () => {
    const token = Cookies.get("TFLoginToken");
    if (!token) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    } else {
      console.log("MealSettings: checkAndRedirect -> Token found");
    }
  };

  //MARK: mealboxSw
  const mealboxSwitchChange = async (value) => {
    shakeBell();
    notifLoadTrigger();
    checkAndRedirect();
    setIsOn(value);
    if (value == true) {
      setPopOverOpen(true);
      setTimeout(() => {
        setPopOverOpen(false);
      }, 10000);
    } else {
      setPopOverOpen(false);
    }
    try {
      const response = await axios.post(`${config.apiBaseUrl}mealbox-switch`, {
        switchValue: value,
        TFLoginToken: Cookies.get("TFLoginToken"),
      });
      console.log("mealboxSwitchChange -> API Response:", response.data);
    } catch (error) {
      console.error("mealboxSwitchChange -> API Error:", error);
    }
  };

  return (
    <>
      <div className="h1_akm" id="mealbox">
        Meal Settings
      </div>
      <div className="card_akm p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center ">
            <span className="h2_akm">Activate mealbox swap</span>
            <span className="ml-2 text-xl">(৳150)</span>
          </div>
          <div className=" ">
            <Popover
              color="foreground"
              isOpen={popOverOpen}
              offset={26}
              crossOffset={22}
            >
              <PopoverTrigger>
                <Switch
                  //MARK: MEALBOX SW
                  isSelected={isOn}
                  size="lg"
                  color="success"
                  onValueChange={(value) => {
                    mealboxSwitchChange(value);
                  }}
                ></Switch>
              </PopoverTrigger>
              <PopoverContent className="w-64 ">
                <div className="px-1 py-2">
                  <div className="text-small font-bold">Mealbox activated!</div>
                  <div className="text-tiny">
                    Your upcoming meals will be delivered in a mealbox.
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <div>
            <Image
              isBlurred
              width={240}
              src="/images/mealbox.png"
              alt="NextUI Album Cover"
              className="m-5"
            />
          </div>

          <div>
            {" "}
            If activated, each meal you receive will be delivered in a new
            mealbox, in exchange for the previous one.
          </div>

          <div className="p-3">
            Why choose a mealbox?
            <ul className="list-disc p-4">
              <li>A healthier alternative to single-use plastic containers.</li>

              <li>
                A refund of ৳150 is available if you deactivate the mealbox at
                any time.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MealSettings;
