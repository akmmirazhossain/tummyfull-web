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

  const checkAndRedirect = () => {
    if (!cookies.TFLoginToken) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    } else {
      return cookies.TFLoginToken;
    }
  };

  //MARK: lunchboxSw
  const lunchboxSwitchChange = async (value) => {
    checkAndRedirect();
    setIsOn(value);
    if (value == true) {
      setPopOverOpen = true;
    }
    try {
      const response = await axios.post(
        "http://192.168.0.216/tf-lara/public/api/lunchbox-switch",
        {
          switchValue: value,
          TFLoginToken: cookies.TFLoginToken,
        }
      );
      console.log("lunchboxSwitchChange -> API Response:", response.data);
    } catch (error) {
      console.error("lunchboxSwitchChange -> API Error:", error);
    }
  };

  //MARK: FETCH USER
  const fetchUserData = async () => {
    const token = cookies.TFLoginToken;

    try {
      const response = await axios.get(
        "http://192.168.0.216/tf-lara/public/api/user-fetch",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const lunchboxStatus = response.data.data.mrd_user_lunchbox;

      //console.log(isOn);
      // console.log("Phone:", response.data.data.phone);
      setIsOn(lunchboxStatus);
    } catch (error) {
      console.error("fetchUserData -> API Error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="w-4/5 py-10 mx-auto">
      <div className=" text-2xl font-bold w-full mb-4">Meal Settings</div>
      <div className="grid grid-cols-6">
        <div className="col-span-2">
          <Image
            isBlurred
            width={240}
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
            alt="NextUI Album Cover"
            className="m-5"
          />
        </div>
        <div className="col-span-4">
          <div className="flex justify-between border-b-2 p-2">
            <div className="flex items-center justify-center">
              <h3 className="text-2xl">Activate mealbox</h3>
              <span className="ml-2 text-xl">(৳150)</span>
            </div>
            <div className="relative ">
              <Popover
                showArrow={false}
                color="foreground"
                isOpen={popOverOpen}
              >
                <PopoverTrigger>
                  <Switch
                    //MARK: MEALBOX SW
                    isSelected={isOn}
                    size="lg"
                    color="success"
                    onValueChange={(value) => {
                      lunchboxSwitchChange(value);
                    }}
                  ></Switch>
                </PopoverTrigger>
                <PopoverContent className="w-64 -top-[90px] -left-24 absolute">
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
            We encourage our customers to make orders regularly and recive them
            is food grade lunchboxes, here are the reasons why:
            <ul className="list-disc p-4">
              <li>
                Healther alternative than one time use plastic containers.
              </li>
              <li>
                The container's price (৳150) will be refunded if you wish
                discontinue our service.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealSettings;
