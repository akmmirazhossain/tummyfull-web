import { React, useRef, useEffect, useState } from "react";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlRice } from "@fortawesome/free-solid-svg-icons";

import NavbarTop from "./components/NavbarTop";
import FooterMain from "./layout/Footer";

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);
  const sectionRef = useRef(null);
  // Setting amount to 0.4 means the animation triggers when 40% of the section is in view
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.5,
  });

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
        "It has a lot of convinient features that has made my meal management very easy, really loving it!",
      name: "AKM Miraz",
      title: "Software Engineer",
      image: "/images/testimonial1.jpg",
    },

    {
      id: 5,
      quote:
        "I was looking for a budget friendly catering, this one is within my budget. ",
      name: "Zaki Abrar ",
      title: "Student",
      image: "/images/testimonial3.jpg",
    },
    {
      id: 2,
      quote:
        "আমি অফিস থেকে বাসায় এসে রান্না করার ঝামেলা নিতে চাইনা, ধন্যবাদ ডালভাত ডট কম কে আমার প্রতিদিনের ডিনার ডেলিভারির জন্য",
      name: "Samia Afrin",
      title: "Marketing Specialist",
      image: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      quote:
        "বাসায় খালা রেগুলার মিস দিতো, এবং খাওয়া-দাওয়ার সমস্যা হতো, এখানে অর্ডার করার পর থেকে আমার মিল মিস হচ্ছে না",
      name: "Enamul Chowdhury",
      title: "Student",
      image: "/images/testimonial3.jpg",
    },
    {
      id: 4,
      quote: "আমার বাসায় গ্যাস থাকে না, তাই আপাতত ডাল ভাত ডট কমে অর্ডার করছি",
      name: "Namira Mateen",
      title: "House Wife",
      image: "/images/testimonial3.jpg",
    },

    {
      id: 6,
      quote:
        "Pretty good, but I prefer an app like foodpanda rather than a website.",
      name: "Ikramul Haque",
      title: "Student",
      image: "/images/testimonial3.jpg",
    },
  ];

  return (
    <div className="">
      <motion.div
        className="fixed w-full"
        initial={{ y: -50, opacity: 0 }}
        animate={showNavbar ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <NavbarTop />
      </motion.div>

      {/* HERO SECTION */}
      <section className=" h-screen   bg_light_orange ">
        <div className="max-w-5xl h-screen   mx-auto flex flex-col lg:flex-row items-center justify-between ">
          {/* Left: Text Content */}
          <div className="flex flex-col items-start lg:w-1/2 pl_akm ml_akm">
            <h1 className="text-xl lg:text-8xl font-bold font-bebas text_green tracking-wide">
              Meal Service
              <br />
              For Students
            </h1>
            <p className="mt-4 text-2xl text-gray-700 font-poppins">
              Study Hard, Eat Well <br />
              We’ve Got Your Meals Covered.
            </p>
            <div className="mt-6 flex space-x-4 ">
              <button className="btn  text-xl btn-lg rounded_akm bg_green font-poppins font-medium text-white hover:bg-orange-500">
                <FontAwesomeIcon icon={faBowlRice} /> Start with a free meal!{" "}
                <motion.div
                  animate={{ x: [0, 10, 0] }} // Moves left to right
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  →
                </motion.div>
              </button>
            </div>

            {/* <div className="h4info_akm mt-1 pl-1">
              (No delivery charge, it's completely free!)
            </div> */}
          </div>

          {/* Right: Image */}
          <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
            <Image
              src={"/images/meal_scheduler_image.svg"}
              width={800}
              height={800}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}

      <section className=" py_akm   h-[50vh]">
        <div className="container max-w-5xl mx-auto my_akm">
          <div className="text-center mb-8 pt_akm">
            <h2 className=" text-3xl font-poppins font-bold text_black">
              How it works?
            </h2>
            {/* <p className=" mt-2">
              While you work or study, we are here to take care of your meals.
              Here are a few reasons how we make your life easier.
            </p> */}
          </div>
          <div className="grid  md:grid-cols-4 lg:grid-cols-4 pb_akm">
            <div className="shadow_akm bg_beige rounded_akm flex flex-col items-center justify-center gap_akm pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 1 </div>
              <div>You Place Pre-order</div>
            </div>

            <div className="shadow_akm bg_light_orange  rounded_akm flex flex-col items-center justify-center gap_akm pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 2</div>
              <div>Meals Are Cooked in Bulk</div>
            </div>

            <div className="shadow_akm bg_orange rounded_akm flex flex-col items-center justify-center gap_akm pad_akm text_black">
              <div className="h3_akm font-bold font-poppins">Step 3</div>
              <div>Delivered to Your Home </div>
            </div>

            <div className="shadow_akm bg_green text_white rounded_akm flex flex-col items-center justify-center gap_akm pad_akm">
              <div className="h3_akm font-bold font-poppins">Step 4</div>
              <div>Enjoy & Repeat</div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="h-screen bg_green19 flex items-center overflow-hidden"
        ref={sectionRef}
      >
        <div className="grid grid-cols-2 items-center justify-center max-w-5xl mx-auto h-full">
          <motion.div
            className="flex flex-col gap_akm"
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
          >
            <motion.div
              className="text-6xl font-bebas"
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
              }}
            >
              Freshly picked, <br /> top-quality ingredients.
            </motion.div>

            <motion.div
              className="text-2xl font-poppins"
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              At Dalbhath, we prepare every meal with premium-quality
              ingredients, ensuring exceptional taste and optimum health.
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
          >
            <Image
              src={"/images/ingredients_group.png"}
              width={800}
              height={800}
              alt="Fresh ingredients"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* <div className="text-center mb-8 pt_akm">
            <h2 className="text_white text-3xl font-extrabold ">
              How We Simplify Your Life?
            </h2>
            <p className="text_white mt-2">
              While you work or study, we are here to take care of your meals.
              Here are a few reasons how we make your life easier.
            </p>
          </div> */}
      {/* <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-3 pb_akm">
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Pre-schedule Your Meals
              </h3>
              <Image
                src={"/images/meal_scheduler_image.svg"}
                width={800}
                height={800}
              />
              <p className="text-gray-600">
                Unlike traditional catering services, you can pre-schedule your
                meals and turn them on or off as needed.{" "}
                <a
                  href="/menu"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Check our menu
                </a>
                .
              </p>
            </div>
           
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Auto-Pay with Built-in Wallet
              </h3>
              <Image
                src={"/images/wallet_pay_home.svg"}
                width={800}
                height={800}
              />
              <p className="text-gray-600">
                Recharge your Dalbhath wallet periodically to automate payments
                for each meal delivery, eliminating the need for cash on
                delivery.
              </p>
            </div>
          
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                Mealbox Swap
              </h3>

              <Image
                src={"/images/mealbox_exchage.webp"}
                width={800}
                height={800}
              />
              <p className="text-gray-600">
                Unlike other catering services, Dalbhath ensures your food is
                delivered in a food-grade mealbox from day one, even for a
                single order.
              </p>
            </div>
          </div> */}

      <section className="bg_beige py_akm">
        <div className="max-w-7xl mx-auto px_akm py_akm my_akm">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text_green">
            What Our Customers Say
          </h2>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map(({ id, quote, name, title, image }) => (
              <div
                key={id}
                className="bg-white p-6 rounded_akm shadow_akm flex flex-col items-center text-center"
              >
                <img
                  src={image}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover shadow-lg"
                />
                <p className="mt-4 text-gray-700 italic">"{quote}"</p>
                <h3 className="mt-4 font-bold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
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
            {/* Mission */}
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
            {/* Vision */}
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
      </section>

      <section className="bg_green text-white py_akm    ">
        <div className="max-w-7xl mx-auto px_akm my_akm">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold">
              🎉 Get Your First Meal Free!
            </h2>
            <p className="mt-2 text-lg">
              Register today and enjoy a delicious meal on us. It's our way of
              welcoming you to the family!
            </p>
          </div>

          <div className="mt-4 lg:mt-0">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100">
              Register Now
            </button>
          </div>
        </div>
      </section>

      <footer className=" bg_beige hidden md:block">
        <FooterMain />
      </footer>
    </div>
  );
}
