// ./layout/Layout.js
import React from "react";

import Head from "next/head";
import NavbarTop from "../components/NavbarTop";
import NavbarBottom from "../components/NavbarBottom";
import FooterMain from "./Footer";

const Layout = ({ children, title }) => {
  return (
    <div className="bg_light_orange text_black">
      {/* <Head>
        <title>
          {title
            ? title
            : "ডালভাত.com - Meal & Catering Service in Bashundhara"}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="DalBhath.com offers home-cooked meal service, food delivery, and catering in Bashundhara Residential Area. Perfect for NSU, AIUB, and IUB students. Order lunch or dinner online now."
        />
        <meta property="og:logo" content="https://dalbhath.com/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/" />
        <meta
          property="og:title"
          content="ডালভাত.com - Meal & Catering Service in Bashundhara"
        />
        <meta
          property="og:description"
          content="DalBhath.com offers home-cooked meal service, food delivery, and catering in Bashundhara Residential Area. Perfect for NSU, AIUB, and IUB students. Order lunch or dinner online now."
        />
        <meta
          property="og:image"
          content="https://dalbhath.com/images/og-main.png"
        />
      </Head> */}
      <header className="fixed z-20 w-full">
        <NavbarTop className="" />
      </header>
      <main className="max-w-5xl min-h-screen pt-16 pb-20 mx-auto md:pb-10 px_akm">
        {children}
      </main>
      <NavbarBottom />
      <footer className="hidden bg_beige md:block">
        <FooterMain />
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/8801748417178?text=Hello"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-30 p-1 transition-transform duration-300 rounded-full bottom-16 right-2 md:bottom-4 md:right-4 hover:scale-110"
      >
        <img
          src="/images/whatsapp-icon.png"
          alt="WhatsApp"
          className="w-12 h-12"
        />
      </a>
    </div>
  );
};

// Layout.propTypes = {
//   children: PropTypes.node.isRequired, // Validate children
//   title: PropTypes.string, // Validate title
// };

export default Layout;
