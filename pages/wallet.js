// pages/wallet.js
import Layout from "./layout/Layout";
import WalletOptions from "./components/WalletOptions";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Layout>
        <WalletOptions />
      </Layout>
    </>
  );
};

const ProtectedPageWithAuth = () => (
  <AuthProvider>
    <ProtectedPage />
  </AuthProvider>
);

export default ProtectedPageWithAuth;
