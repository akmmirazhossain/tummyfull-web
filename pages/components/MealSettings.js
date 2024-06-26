// components/GeneralSettings.js

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import {
  Image,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const MealSettings = () => {
  const [isOn, setIsOn] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [cookies] = useCookies(["TFLoginToken"]);
  const router = useRouter();

  const [config, setConfig] = useState(null);

  useEffect(() => {
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

  const checkAndRedirect = () => {
    if (!cookies.TFLoginToken) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    } else {
      return cookies.TFLoginToken;
    }
  };

  //MARK: mealboxSw
  const mealboxSwitchChange = async (value) => {
    checkAndRedirect();
    setIsOn(value);
    if (value == true) {
      setPopOverOpen(true);
      setTimeout(() => {
        setPopOverOpen(false);
      }, 8000);
    } else {
      setPopOverOpen(false);
    }
    try {
      const response = await axios.post(`${config.apiBaseUrl}mealbox-switch`, {
        switchValue: value,
        TFLoginToken: cookies.TFLoginToken,
      });
      console.log("mealboxSwitchChange -> API Response:", response.data);
    } catch (error) {
      console.error("mealboxSwitchChange -> API Error:", error);
    }
  };

  useEffect(() => {
    //MARK: FETCH USER
    const fetchUserData = async () => {
      if (!config) return; // Exit early if config is not yet fetched

      const { apiBaseUrl } = config;
      const token = cookies.TFLoginToken;

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

  return (
    <div className="w-4/5 py-10 mx-auto">
      <div className=" text-2xl font-bold w-full mb-4">Meal Settings</div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">
          <Image
            isBlurred
            width={240}
            src="/images/tiffin_carrier.jpg"
            alt="NextUI Album Cover"
            className="m-5"
          />
        </div>
        <div className="col-span-4">
          <div className="flex justify-between border-b-2 p-2">
            <div className="flex items-center justify-center">
              <h3 className="text-2xl">Activate personal mealbox</h3>
              <span className="ml-2 text-xl">(৳150)</span>
            </div>
            <div className=" ">
              <Popover
                showArrow
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
                    <div className="text-small font-bold">
                      Mealbox activated!
                    </div>
                    <div className="text-tiny">
                      You will recieve your upcoming meals in a mealbox.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="p-3">
            Why you should have a mealbox?
            <ul className="list-disc p-4">
              <li>
                Healthier alternative than one time use plastic containers.
              </li>
              <li>
                Total two mealboxes will be assigned to you, our delivery person
                will collect the previous (empty) one and deliver you the new
                one with food on each delivery.
              </li>
              <li>
                ৳150 will be refunded if you deactivate the mealbox anytime.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealSettings;
