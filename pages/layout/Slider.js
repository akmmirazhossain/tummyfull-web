"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useRouter } from "next/navigation";

const items = [
  {
    src: "/images/chef.png",
    alt: "Hot Homecooked",
    link: "/info",
    hash: "features",
  },

  {
    src: "/images/mealbox_swap_slider.png",
    alt: "Swap mealbox",
    link: "/settings",
    hash: "mealbox",
  },
  // {
  //   src: "/images/premium_quality.png",
  //   alt: "Cooked with Preium Ingredients",
  //   link: "/info",
  //   hash: "features",
  // },
  {
    src: "/images/calendar.png",
    alt: "Hot Homecooked",
    link: "/info",
    hash: "features",
  },
  {
    src: "/images/wallet.png",
    alt: "Hot Homecooked",
    link: "/wallet",
    hash: "",
  },
];

export default function Slider() {
  const router = useRouter();

  const handleItemClick = (e, item) => {
    e.preventDefault();

    // Navigate to the page
    router.push(item.link);

    // After navigation, scroll to the hash if it exists
    if (item.hash) {
      // Small timeout to ensure the page has loaded
      setTimeout(() => {
        const element = document.getElementById(item.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <div className="pt_akm">
      <Swiper
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
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        modules={[Autoplay]}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <a
              href={`${item.link}${item.hash ? "#" + item.hash : ""}`}
              onClick={(e) => handleItemClick(e, item)}
            >
              <div className="bg-gradient-to-r from-rose-100 to-teal-100 rounded_akm shadow_akm h-auto flex items-center justify-center overflow-hidden ">
                <Image
                  src={item.src}
                  height={200}
                  width={400}
                  alt={item.alt}
                  quality={75}
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
