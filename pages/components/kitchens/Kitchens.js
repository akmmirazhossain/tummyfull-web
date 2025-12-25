// pages/components/kitchens/Kitchens.js

"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import KitchensNearest from "./KitchensNearest";
import GetUserGps from "../map/GetUserGps";
import { createLogger } from "../../../lib/logger";
const logger = createLogger("Kitchens");

export default function Kitchens({ setRefreshMenu, onKitchenSelect }) {
  const router = useRouter();
  const [kitchens, setKitchens] = useState([]);
  const [coords, setCoords] = useState(null);
  const [locationAccessible, setLocationAccessible] = useState(false);
  const [locationMessage, setLocationMessage] = useState(false);
  const [hasKitchen, setHasKitchen] = useState(false);

  const swiperRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("noKitchenNearby");
    setHasKitchen(stored);
  }, []);

  const kitchenMenuView = (event, kitchen) => {
    event.preventDefault();
    localStorage.setItem("selectedKitchenId", kitchen.kitchenId);

    // logger.info(kitchen);

    // Pass the selected kitchen data to parent
    if (onKitchenSelect) {
      onKitchenSelect(kitchen);
    }

    setRefreshMenu(true);

    // Stop autoplay when a kitchen is clicked
    if (swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
    }
  };

  return (
    <div className="pt_akm">
      {coords && (
        <KitchensNearest
          userLatitude={coords.latitude}
          userLongitude={coords.longitude}
          onKitchensUpdate={setKitchens}
        />
      )}
      <GetUserGps
        onCoordinates={setCoords}
        setLocationAccessible={setLocationAccessible}
        setLocationMessage={setLocationMessage}
      />
      {locationAccessible ? (
        <>
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={2}
            spaceBetween={8}
            slidesPerGroup={2}
            breakpoints={{
              768: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
            }}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            modules={[Autoplay]}
          >
            {kitchens.map((kitchen, index) => (
              <SwiperSlide key={kitchen.mrd_kitchen_id || index}>
                <Button
                  onClick={(e) => kitchenMenuView(e, kitchen)}
                  className="flex items-center justify-center h-auto overflow-hidden pad_akm rounded_akm shadow_akm bg-gradient-to-r from-rose-100 to-teal-100 "
                >
                  <div className="flex gap-1 lg:gap-2 ">
                    <div className="flex items-center justify-center w-2/5">
                      <Image
                        src={"https://dalbhath.com/images/food/rice.png"}
                        width={100}
                        height={100}
                        alt="food"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1 w-3/5 text-left min-h-20">
                      <div className="font-medium truncate line-clamp-1">
                        {kitchen.kitchenName}
                      </div>
                      <div className="flex h4_akm gap_akm">
                        <div className="flex items-center gap-1">
                          <span>
                            <Icon
                              className="text-yellow-500"
                              icon="fa-solid:star"
                            />
                          </span>
                          <span>{kitchen.kitchenRating || "0.0"}</span>
                        </div>
                        <div className="flex gap-1 ">
                          <span className="flex items-center justify-end">
                            <Icon
                              icon="material-symbols:moped-package-rounded"
                              className="w-full h-full"
                            />
                          </span>
                          <span>{kitchen.kitchenDeliveryCharge || 0}</span>
                        </div>
                      </div>
                      <div className="truncate h4info_akm line-clamp-1">
                        {kitchen.kitchenDistance?.toFixed(1)} km away
                      </div>
                    </div>
                  </div>
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <>
          {locationMessage && (
            <div className="text-center">
              Location needs to be accessible to display kitchens in your area.
            </div>
          )}
          {hasKitchen && (
            <div className="text-center">No Kitchen was found Nearby</div>
          )}
        </>
      )}
    </div>
  );
}
