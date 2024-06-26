// ./layout/Layout.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children, title }) => {
  return (
    <div className="bg_light_orange text_black">
      <Head>
        <title>{title ? title : "খেয়েছ?"}</title>
        {/* Other head meta tags, stylesheets, scripts, etc. */}
      </Head>
      <header className="fixed w-full z-20">
        <Navbar />
      </header>
      <main className="max-w-5xl mx-auto min-h-screen pt-16 ">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
