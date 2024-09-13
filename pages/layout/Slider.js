import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const items = [
  {
    src: "/images/delivery.png",
    alt: "Free Delivery",
    link: "/info#features",
  },
  {
    src: "/images/calendar.png",
    alt: "Hot Homecooked",
    link: "/info#features",
  },
  {
    src: "/images/chef.png",
    alt: "Hot Homecooked",
    link: "/info#features",
  },
  {
    src: "/images/wallet.png",
    alt: "Hot Homecooked",
    link: "/wallet",
  },
];

export default function Slider() {
  return (
    <div className="pt_akm">
      <Swiper
        slidesPerView={2} // Default for small screens (below 640px)
        spaceBetween={8}
        slidesPerGroup={2}
        breakpoints={{
          768: {
            slidesPerView: 4,
            spaceBetween: 16,
            slidesPerGroup: 2,
          },
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        modules={[Autoplay]}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <Link href={item.link}>
              <div className="bg-gradient-to-r from-rose-100 to-teal-100 rounded_akm shadow_akm h-auto flex items-center justify-center overflow-hidden">
                <Image
                  src={item.src}
                  height={200}
                  width={400}
                  alt={item.alt}
                  className="object-cover h-full w-full"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
