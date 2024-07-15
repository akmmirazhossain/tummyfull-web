// pages/settings.js
import Layout from "./layout/Layout"; // Adjust this path based on your structure
import ProfileForm from "./components/ProfileForm"; // Correct import path
import Notification from "./components/Noification";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

const NotifPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <Notification />
    </Layout>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <NotifPage />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
