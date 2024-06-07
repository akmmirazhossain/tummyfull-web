// layout.js
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = ({ children, title }) => {
  return (
    <div>
      <Head>
        <title>{title ? title : "Menu"}</title>
        {/* Other head meta tags, stylesheets, scripts, etc. */}
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="max-w-5xl mx-auto min-h-screen">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
