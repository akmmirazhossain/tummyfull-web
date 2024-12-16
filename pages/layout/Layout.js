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
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired, // Validate children
  title: PropTypes.string, // Validate title
};

export default Layout;
