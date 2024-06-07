// pages/index.js
import Layout from "./layout/Layout";
import MenuComp from "./components/MenuComp";

export default function Menu({ menu }) {
  return (
    <>
      <Layout>
        <MenuComp />
      </Layout>
    </>
  );
}
