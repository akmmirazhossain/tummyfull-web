import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LogoutButton from "./components/LogoutButton";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const checkLoginStatus = () => {
      // For this simple example, we check localStorage
      // In a real scenario, check authentication state or cookie/session
      if (localStorage.getItem("isLoggedIn")) {
        setIsLoggedIn(true);
      } else {
        console.log("Redirecting to login page...");
        router.push("/login");
      }
    };

    checkLoginStatus();
  }, [router]);

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to the protected page!</h1>
      <LogoutButton />
    </div>
  );
};

export default Home;
