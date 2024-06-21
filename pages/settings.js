// pages/settings.js
import Layout from "./layout/Layout"; // Adjust this path based on your structure
import ProfileForm from "./components/ProfileForm"; // Correct import path
import MealSettings from "./components/MealSettings";

export default function Settings() {
  return (
    <Layout>
      <ProfileForm />
      <MealSettings />
    </Layout>
  );
}
