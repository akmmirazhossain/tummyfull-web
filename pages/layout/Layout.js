// ./layout/Layout.js
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import NavbarTop from "../components/NavbarTop";
import NavbarBottom from "../components/NavbarBottom";
import FooterMain from "./Footer";

const Layout = ({ children, title }) => {
  return (
    <div className="bg_light_orange text_black">
      <Head>
        <title>{title ? title : "ডালভাত.com"}</title>
        <meta
          name="description"
          content="DalBhath is an easy meal management app for students, job holders, and families seeking convenient daily meal options."
        />
        <meta property="og:logo" content="https://dalbhath.com/logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/" />
        <meta property="og:title" content="ডালভাত.com" />
        <meta
          property="og:description"
          content="DalBhath is an easy meal management app for students, job holders, and families seeking convenient daily meal options."
        />
        <meta
          property="og:image"
          content="https://dalbhath.com/images/og-main95tk.webp"
        />
      </Head>
      <header className="fixed w-full z-20">
        <NavbarTop className="" />
      </header>
      <main className="max-w-5xl mx-auto min-h-screen pt-16 pb-20 md:pb-10 px_akm">
        {children}
      </main>
      <NavbarBottom />
      <footer className=" bg_beige hidden md:block">
        <FooterMain />
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/8801748417178?text=Hello"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed z-30 bottom-16 right-2 md:bottom-4 md:right-4  p-1 rounded-full hover:scale-110 transition-transform duration-300"
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

Layout.propTypes = {
  children: PropTypes.node.isRequired, // Validate children
  title: PropTypes.string, // Validate title
};

export default Layout;
