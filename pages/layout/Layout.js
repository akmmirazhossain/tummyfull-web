// ./layout/Layout.js

import Head from "next/head";
import NavbarTop from "../components/NavbarTop";
import NavbarBottom from "../components/NavbarBottom";
import FooterMain from "./Footer";

const Layout = ({ children, title }) => {
  return (
    <div className="bg_light_orange text_black">
      <Head>
        <title>{title ? title : "ডালভাত"}</title>
        <meta name="description" content="Your page description goes here." />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.dalbhath.com/" />
        <meta property="og:title" content="ডালভাত.com" />
        <meta
          property="og:description"
          content="DalBhath is a meal management app that helps college students living in shared apartments easily plan and manage their daily lunch and dinner, ensuring they always have a meal without the hassle of cooking or organizing."
        />
        <meta property="og:image" content="https://dalbhath.com/logo.png" />
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

export default Layout;
