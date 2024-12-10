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
      id: 5,
      quote:
        "I was looking for a budget friendly catering, this one is within my budget. ",
      name: "Zaki Abrar ",
      title: "Student",
      image: "/images/testimonial3.jpg",
    },

    {
      id: 6,
      quote:
        "This is good, but I prefer an app like foodpanda rather than a website.",
      name: "Zaki Abrar ",
      title: "Student",
      image: "/images/testimonial3.jpg",
    },
  ];

  return (
    <div className="">
      <NavbarTop />
      <section className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-20">
        {/* Left: Text Content */}
        <div className="flex flex-col items-start lg:w-1/2">
          <h1 className="text-xl lg:text-5xl font-bold text_green leading-snug">
            Healthy, affordable meals
            <br /> delivered to your doorstep!
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Affordable, healthy, and freshly prepared meals for busy students,
            professionals, and families. No hassle, no compromise.
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="btn rounded_akm">Order Now</button>
            <button className="btn rounded_akm bg_green text-white">
              View Menu
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

      <section className="bg_green text-white py-6 px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between  shadow-lg">
        {/* Text Section */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-bold">
            🎉 Get Your First Meal Free!
          </h2>
          <p className="mt-2 text-lg">
            Register today and enjoy a delicious meal on us. It's our way of
            welcoming you to the family!
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-4 lg:mt-0">
          <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100">
            Register Now
          </button>
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-6 lg:px-20">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-blue-600">
          What Our Customers Say
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map(({ id, quote, name, title, image }) => (
            <div
              key={id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
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
      </section>
      <footer className=" bg_beige hidden md:block">
        <FooterMain />
      </footer>
    </div>
  );
}
