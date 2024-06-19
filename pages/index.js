// pages/index.js
import Layout from "./layout/Layout";
import MenuComp from "./components/menu2";
import Announcement from "./components/Announcement";

export default function Menu() {
  return (
    <>
      <Layout>
        {/* <Announcement /> */}
        <MenuComp />
      </Layout>
    </>
  );
}
