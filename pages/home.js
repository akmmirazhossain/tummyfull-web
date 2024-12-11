import React from "react";
import Layout from "./layout/Layout";
import NavbarTop from "./components/NavbarTop";
import FooterMain from "./layout/Footer";

export default function HeroSection() {
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
      <NavbarTop />
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between py-12 ">
        {/* Left: Text Content */}
        <div className="flex flex-col items-start lg:w-1/2">
          <h1 className="text-xl lg:text-5xl font-bold text_green leading-snug">
            Healthy, affordable meals
            <br /> delivered to your doorstep!
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            DalBhath is an easy meal management web app for students, job
            holders, and families seeking convenient daily meal options.
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="btn btn-lg rounded_akm bg_green text-white">
              Visit App
            </button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="mt-10 lg:mt-0 lg:w-1/2 flex justify-center">
          <img
            src="https://www.tailwind-kit.com/images/object/10.png"
            alt="Delicious meal"
            className="w-full max-w-lg "
          />
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

      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">
              How We Simplify Your Life?
            </h2>
            <p className="text-gray-600 mt-2">
              Experience the convenience and flexibility of our meal management
              system, tailored to your lifestyle.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {/* Feature 1 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Schedule and Control Your Meals
              </h3>
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
            {/* Feature 2 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Auto-Pay with Built-in Wallet
              </h3>
              <p className="text-gray-600">
                Top up your built-in wallet to enable auto-pay. If sufficient
                credit is available, the meal charge will be deducted from it,
                eliminating cash on delivery.{" "}
                <a
                  href="/wallet"
                  className="text-green-500 font-medium hover:underline"
                >
                  Visit wallet
                </a>
                .
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                Environment-Friendly Mealbox Swap
              </h3>
              <p className="text-gray-600">
                Use our service regularly and activate the mealbox swap option
                to have your meals delivered in food-grade boxes instead of
                polybags.{" "}
                <a
                  href="/mealbox-swap"
                  className="text-indigo-500 font-medium hover:underline"
                >
                  Activate mealbox swap
                </a>
                .
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-4">
                One-Touch Order Cancellation
              </h3>
              <p className="text-gray-600">
                Easily cancel your orders with a single touch if your plans
                change. Designed for your convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

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
      <footer className=" bg_beige hidden md:block">
        <FooterMain />
      </footer>
    </div>
  );
}
