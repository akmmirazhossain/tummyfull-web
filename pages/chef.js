// pages/index.js
import Layout from "./layout/Layout";
import OrderList from "./components/ChefToCookNow";

export default function Menu() {
  return (
    <>
      <Layout>
        <div className="text-2xl border-b-2">Chef page</div>
        <OrderList />
      </Layout>
    </>
  );
}
