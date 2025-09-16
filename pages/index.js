"use client";
import { React, useRef, useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlRice,
  faAngleRight,
  faDiamond,
  faCircle,
  faCaretRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { faGem } from "@fortawesome/free-regular-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import NavbarTop from "./components/NavbarTop";
import FooterMain from "./layout/Footer";
import { AnimatedSection, AnimatedContent } from "../hooks/animation";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);
  const sectionRef = useRef(null);
  const router = useRouter();
  const [discount, setDiscount] = useState(null);

  const [menuRedir, setMenuRedir] = useState(null);

  // Inside your component:
  const [buttonTextHero, setButtonTextHero] = useState("First Meal 80% Off!");
  const [buttonTextCTA, setButtonTextCTA] = useState("Login and Order Now");

  useEffect(() => {
    const storedRef = sessionStorage.getItem("menuRedir");
    const token = Cookies.get("TFLoginToken");
    setMenuRedir(storedRef);
    sessionStorage.removeItem("menuRedir");

    if (token && !storedRef) {
      router.push("/menu");
    }
  }, []);

  useEffect(() => {
    fetch("/api/regDiscount")
      .then((res) => res.json())
      .then((data) => setDiscount(data.discount));
  }, []);

  useEffect(() => {
    if (Cookies.get("TFLoginToken")) {
      setButtonTextHero("Visit menu page");
      setButtonTextCTA("Visit menu page");
    } else {
      if (discount !== null) {
        setButtonTextHero(`First Meal ${discount}% Off!`);
      }
    }
  }, [discount]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const testimonials = [
    {
      id: 1,
      quote:
        "It has a lot of convinient features that has made my meal management very easy, great job!",
      name: "AKM Miraz",
      title: "Software Engineer",
      image: "/images/testimonials/akm_miraz.jpg",
    },

    {
      id: 5,
      quote:
        "I was looking for a budget friendly catering, this one is within my budget. ",
      name: "Zaki Abrar ",
      title: "Student",
      image: "/images/testimonials/zaki.jpg",
    },
    {
      id: 2,
      quote:
        "আমি অফিস থেকে বাসায় এসে রান্না করার ঝামেলা নিতে চাইনা, ধন্যবাদ ডালভাত ডট কম কে আমার প্রতিদিনের ডিনার ডেলিভারির জন্য",
      name: "Samia Afrin",
      title: "Marketing Specialist",
      image: "/images/testimonials/samia.jpg",
    },
    {
      id: 6,
      quote:
        "Pretty good, but I prefer an app like foodpanda rather than a website.",
      name: "Ikramul Haque",
      title: "Student",
      image: "/images/testimonials/ikramul.jpg",
    },
    {
      id: 3,
      quote:
        "বাসায় খালা রেগুলার মিস দিতো, এবং খাওয়া-দাওয়ার সমস্যা হতো, এখানে অর্ডার করার পর থেকে আমার মিল মিস হচ্ছে না",
      name: "Enamul Chowdhury",
      title: "Student",
      image: "/images/testimonials/enamul.jpg",
    },
    {
      id: 4,
      quote: "আমার বাসায় গ্যাস থাকে না, তাই আপাতত ডাল ভাত ডট কমে অর্ডার করছি",
      name: "Namira Mateen",
      title: "House Wife",
      image: "/images/testimonials/namira.jpg",
    },
  ];

  const images = [
    "/images/food/rice.png",
    "/images/food/pabda_curry.png",
    "/images/food/tilapia_curry.png",
    "/images/food/chicken_curry.png",
    "/images/food/rui_curry.png",
    "/images/food/dal_shobji.png",
  ];

  return (
    <div className="">
      <Head>
        <title>dalbhath.com</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="description"
          content="DalBhath.com is the easiest way for students and residents in Bashundhara to order affordable, home-cooked daily meals and catering services."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/" />
        <meta
          property="og:title"
          content="dalbhath.com - Meal & Catering Service in Bashundhara"
        />
        <meta
          property="og:description"
          content="DalBhath.com offers home-cooked meals, food delivery, and bulk catering in Bashundhara Residential Area. Perfect for students of NSU, AIUB, IUB. Order lunch or dinner today."
        />
        <meta
          property="og:image"
          content="https://dalbhath.com/images/og-main.jpg"
        />
      </Head>

      <motion.div
        className="fixed w-full z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={showNavbar ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NavbarTop />
      </motion.div>

      {/* HERO SECTION */}

      <AnimatedSection className="md:h-screen py-12 bg_light_orange flex items-center">
        <div className="grid md:grid-cols-2 items-center justify-center max-w-7xl mx-auto h-full">
          <div className="flex flex-col gap-6 md:gap-5 pl-8">
            <AnimatedContent
              direction="up"
              delay={0}
              className="  flex flex-col text-6xl sm:text-8xl  md:text-8xl font-bold font-bebas text_green tracking-wide"
            >
              <h1 className="">
                Meal Service
                <br />
                For Students
              </h1>
            </AnimatedContent>

            <AnimatedContent
              direction="up"
              delay={0}
              className=" text-2xl text-gray-700 font-poppins"
            >
              Study Hard, Eat Well <br />
              We’ve Got Your Meals Covered.
            </AnimatedContent>

            {/* GO TO MENU BUTTION FOR BIG SCREEN */}
            <AnimatedContent
              direction="up"
              delay={0}
              className="  items-center justify-center  hidden lg:block mt-1"
            >
              <Link
                href={"/menu"}
                className="btn  text-xl btn-lg rounded_akm bg_green font-poppins font-medium text-white hover:bg-orange-500"
              >
                <FontAwesomeIcon icon={faBowlRice} className="h-5 w-5" />
                {buttonTextHero}
                <motion.div
                  animate={{ x: [0, 10, 0] }} // Moves left to right
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                </motion.div>
              </Link>
            </AnimatedContent>
          </div>

          {/* IMAGE */}
          <AnimatedContent
            direction="up"
            delay={0}
            className="w-full flex flex-col items-center justify-center p-4 m:p-0"
          >
            <Image
              src={"/images/meal_scheduler_image.webp"}
              width={800}
              height={800}
              alt="meal_scheduler_image"
            />
          </AnimatedContent>

          {/* GO TO MENU BUTTION FOR SMALL SCREEN */}
          <AnimatedContent
            direction="up"
            delay={0}
            className="flex  items-center justify-center  lg:hidden py_akm"
          >
            <Link
              href={"/menu"}
              className="btn  text-xl btn-lg  rounded_akm bg_green font-poppins font-medium text-white hover:bg-orange-500"
            >
              <FontAwesomeIcon icon={faBowlRice} className="h-5 w-5" />
              {buttonTextHero}
              <motion.div
                animate={{ x: [0, 10, 0] }} // Moves left to right
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
              </motion.div>
            </Link>
          </AnimatedContent>
        </div>
      </AnimatedSection>

      {/* HOW IT WORKS SECTION */}

      <section className=" py_akm  bg_beige">
        <div className="container p-4 max-w-5xl mx-auto my_akm">
          <div className="text-center mb-8 pt_akm">
            <h2 className=" text-3xl font-poppins font-bold text_black">
              How it works?
            </h2>
          </div>

          <div className="grid grid-cols-2  md:grid-cols-3 gap_akm  pb_akm">
            <div className="  rounded_akm flex flex-col items-center justify-center gap-1 pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 1</div>
              <div className="pb_akm">You Place Pre-order</div>
              <div>
                <Image
                  className=""
                  layout="intrinsic"
                  width={140}
                  height={140}
                  src="/images/order.png"
                  alt="Rice"
                />
              </div>
            </div>

            <div className="  flex flex-col items-center justify-center gap-1 pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 2</div>
              <div className="pb_akm"> We Cook Your Meal</div>
              <div>
                <Image
                  className=""
                  layout="intrinsic"
                  width={140}
                  height={140}
                  src="/images/cooking.png"
                  alt="Rice"
                />
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center text-center gap-1 pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 3</div>
              <div className="pb_akm">We Deliver to You</div>
              <div>
                <Image
                  className=""
                  layout="intrinsic"
                  width={140}
                  height={140}
                  src="/images/fast-shipping2.png"
                  alt="Rice"
                />
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-center">
            {" "}
            <div className="   flex flex-col items-center justify-center text-center gap-1 pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 3</div>
              <div className="pb_akm">We Deliver to You</div>
              <div>
                <Image
                  className=""
                  layout="intrinsic"
                  width={140}
                  height={140}
                  src="/images/fast-shipping2.png"
                  alt="Rice"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="md:h-screen py-12 bg_green flex items-center">
        <div className="grid md:grid-cols-2 items-center justify-center max-w-7xl mx-auto h-full">
          <AnimatedContent
            direction="left"
            className="flex flex-col gap-6 md:gap-8 pl-8"
          >
            <AnimatedContent
              direction="up"
              delay={0.3}
              className=" text-7xl md:text-8xl font-bebas flex"
            >
              Fresh, quality <br />
              ingredients
            </AnimatedContent>

            <AnimatedContent
              direction="up"
              delay={0.5}
              className="text-2xl font-poppins"
            >
              At Dalbhath, we prepare every meal with premium-quality
              ingredients, ensuring great taste and optimum health.
            </AnimatedContent>
          </AnimatedContent>

          <AnimatedContent direction="right" className="w-full">
            <Image
              src="/images/ingredients_group.webp"
              width={800}
              height={800}
              alt="Fresh ingredients"
              className="w-full h-auto"
            />
          </AnimatedContent>
        </div>
      </AnimatedSection>

      <section className="bg_beige py_akm">
        <div className="max-w-7xl mx-auto px_akm py_akm my_akm">
          <h2 className="text-3xl lg:text-3xl font-poppins font-bold text-center text_green">
            What Our Customers Say
          </h2>

          <div className="mt-10">
            <Swiper
              slidesPerView={1} // Default for small screens (below 640px)
              spaceBetween={8}
              slidesPerGroup={1}
              breakpoints={{
                768: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                  // slidesPerGroup: 2,
                },
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              modules={[Autoplay, Navigation]}
              className="mySwiper"
            >
              {testimonials.map(({ id, quote, name, title, image }) => (
                <SwiperSlide key={id} className="h-auto py_akm">
                  <div className="bg-white p-6 rounded_akm shadow_akm flex flex-col items-center text-center min-h-72">
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 rounded-full object-cover shadow-lg"
                    />
                    <p className="mt-4 text-gray-700 italic">{quote}</p>
                    <div className="mt-auto pt-4">
                      <h3 className="font-bold text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-500">{title}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <AnimatedSection className="  bg_light_orange  flex items-center px-6 py-8">
        {" "}
        <div className="max-w-7xl flex flex-col-reverse lg:grid lg:grid-cols-7  mx-auto w-full">
          <AnimatedContent
            direction="left"
            delay={0.6}
            className=" col-span-3 flex flex-col gap-8"
          >
            <Image
              src={"/images/boy_chilling.png"}
              width={800}
              height={800}
              alt="Fresh ingredients"
              className="w-full h-auto"
            />
          </AnimatedContent>

          <AnimatedContent
            direction="right"
            delay={0.6}
            className="col-span-4 flex flex-col gap_akm justify-center lg:px-6"
          >
            <div className="text-7xl  lg:text-8xl font-bebas text_green text-left">
              We Simplify <br /> Your Life!
            </div>

            <AnimatedContent
              direction="up"
              delay={0.8}
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6 w-full justify-center "
            >
              <div className="bg_beige shadow-lg hover:shadow-xl  text_black rounded_akm p-4 lg:p-6 font-poppins  transform transition duration-500 hover:-translate-y-1 ">
                <div className=" font-bold pl_akm pb-0.5 text-xl font-bebas tracking-widest">
                  Money Saved
                </div>
                <ul>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
                    No grocery shopping
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    No gas refills
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    No maid hiring
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    No kitchen setup
                  </li>
                </ul>
              </div>
              <div className="bg_green  text-white rounded_akm p-4 lg:p-6   font-poppins transform transition duration-500 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                <div className=" font-bold pl_akm pb-0.5 text-lg font-bebas tracking-widest">
                  App Benefits
                </div>

                <ul>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
                    Meal Reminder via SMS
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    One Touch Pre-order
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    Mealbox from Day 1
                  </li>
                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    Easy Cancellation
                  </li>

                  <li className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faAngleRight} size="xs" />
                    Pay from Dalbhath Wallet
                  </li>
                </ul>
              </div>
            </AnimatedContent>
          </AnimatedContent>
        </div>
      </AnimatedSection>

      {/* <AnimatedSection className="h-screen bg_green flex items-center">
        <div className="max-w-5xl grid grid-cols-2 items-center justify-center  mx-auto  border-blue-600 border">
          <AnimatedContent direction="left" className="flex flex-col gap-8">
            <AnimatedContent direction="left" className="flex flex-col gap-8">
              <Image
                src={"/images/boy_chilling.png"}
                width={800}
                height={800}
                alt="Fresh ingredients"
                className="w-full h-auto"
              />
            </AnimatedContent>
          </AnimatedContent>

          <AnimatedContent direction="right" className="w-full grid">
            
          </AnimatedContent>
        </div>
      </AnimatedSection> */}

      {/* <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Our Mission & Vision
            </h2>
            <p className="text-gray-600 mt-2">
              Delivering nutritious meals while fostering a community that
              values health, convenience, and sustainability.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To provide fresh, affordable, and wholesome meals to
                individuals, families, and professionals, simplifying their
                lives with reliable and delicious meal services.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To revolutionize meal management by creating a trusted network
                that ensures no one struggles with access to healthy and
                affordable food.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section
        ref={sectionRef}
        className="relative  py-8  bg-[url('/images/kitchen_bg.png')] bg-cover bg-center bg-no-repeat text-white  lg:h-[70vh] flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#004225] bg-opacity-30"></div>

        {/* <div className="absolute inset-0">
          <Confetti
            width={width}
            height={sectionHeight}
            confineToContainer={true}
            recycle={true}
            numberOfPieces={100}
            colors={["#FFC107", "#FF9800", "#FF5722", "#F44336", "#FFEB3B"]}
          />
        </div> */}
        <div className="max-w-7xl  mx-auto flex justify-center items-center flex-col px-6 pb-4 relative z-10">
          <h2 className="text-7xl font-bebas">
            {discount !== null
              ? `First Meal ${discount}% Off!`
              : "First Meal Discount!"}
          </h2>
          <p className="font-poppins h3_akm">
            {discount !== null
              ? `Claim Your ${discount}% Off Meal – Limited Time!`
              : "Claim Your Discounted Meal – Limited Time!"}
          </p>

          <Link href={"/menu"}>
            <motion.button
              className="btn btn-md mt-2 rounded_akm"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {buttonTextCTA}
            </motion.button>
          </Link>
        </div>
        <div className="overflow-hidden w-full relative">
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 100, // Adjust speed
              repeat: Infinity,
            }}
            style={{ display: "flex", whiteSpace: "nowrap" }}
          >
            {/* Triple the images for a smooth, uninterrupted scroll */}
            {[...images, ...images, ...images].map((src, index) => (
              <Image
                key={index}
                src={src}
                width={140}
                height={140}
                alt="Food Item"
                className="shrink-0"
              />
            ))}
          </motion.div>
        </div>
      </section>

      <footer className=" bg_beige hidden md:block text_black">
        <FooterMain />
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
