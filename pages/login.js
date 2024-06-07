import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@nextui-org/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/loginApi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/testlogin");
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  //NEXT UI VALIDATION
  const [value, setValue] = React.useState("");
  const validatePhoneNumber = (value) => /^(01)\d{9}$/.test(value);
  const isInvalid = React.useMemo(() => {
    if (value === "") return false;
    return validatePhoneNumber(value) ? false : true;
  }, [value]);
  //

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <form onSubmit={handleSubmit}>
        <Input
          value={value}
          id="phone"
          type="text"
          label="Phone"
          variant="bordered"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "success"}
          errorMessage="Please enter a valit 11 digit phone number"
          onValueChange={setValue}
          className="max-w-xs"
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
