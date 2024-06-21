// components/GeneralSettings.js

import React from "react";
import {
  Image,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCaretDown } from "@fortawesome/free-solid-svg-icons";

const MealSettings = () => {
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
              <h3 className="text-2xl">Activate lunchbox</h3>
              <span className="ml-2 text-xl">(৳150)</span>
            </div>
            <div className="relative ">
              <Popover showArrow={false} color="foreground">
                <PopoverTrigger>
                  <Switch defaultSelected size="lg" color="success"></Switch>
                </PopoverTrigger>
                <PopoverContent className="w-64 -top-[90px] -left-24 absolute">
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">
                      Lunchbox activated!
                    </div>
                    <div className="text-tiny">
                      You will recieve your upcoming meals in lunchboxes.
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="p-3">
            We encourage our customers to make orders regularly and recive them
            is food grade lunchboxes, here are the reasons why:
            <ul class="list-disc p-4">
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
