// ./layout/Layout.js

import Head from "next/head";
import NavbarTop from "../components/NavbarTop";
import NavbarBottom from "../components/NavbarBottom";

const Layout = ({ children, title }) => {
  return (
    <div className="bg_light_orange text_black">
      <Head>
        <title>{title ? title : "ডালভাত"}</title>
      </Head>
      <header className="fixed w-full z-20">
        <NavbarTop className="" />
      </header>
      <main className="max-w-5xl mx-auto min-h-screen pt-16 pb-20 px_akm">
        {children}
      </main>
      <footer className="fixed w-full z-20  bottom-0 ">
        <NavbarBottom />
      </footer>
    </div>
  );
};

export default Layout;
