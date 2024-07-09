// ./components/LoginForm.js
import React, { useState, useEffect, useMemo } from "react";
import { Input, Spacer, Button as ModalButton } from "@nextui-org/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Head from "next/head";

const LoginForm = () => {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  const router = useRouter();

  useEffect(() => {
    // Fetch config.json on component mount
    const fetchConfig = async () => {
      try {
        const response = await fetch("../../config.json"); // Adjust URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  const validatePhoneNumber = (value) => /^(01)\d{9}$/.test(value);
  const isInvalid = useMemo(() => {
    if (value === "") return true;
    return !validatePhoneNumber(value);
  }, [value]);

  //MARK: SendOTP
  const handleSendOTP = async () => {
    if (isInvalid) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: value }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("OTP sent successfully, setting state");
        setIsOtpSent(true);
        setError(null); // Reset any existing error
      } else {
        console.log("OTP not sent, setting error");
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  //MARK: VerifyOTP
  const handleVerifyOTP = async (setModalContent) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: value, otp: otp }),
      });

      console.log("handleVerifyOTP -> Response status:", response.status);

      const data = await response.json();
      console.log("handleVerifyOTP -> OTP verification result:", data);

      if (data.status === "success") {
        console.log(
          "handleVerifyOTP -> data.status === success > token",
          data.token
        );
        Cookies.set("TFLoginToken", data.token, { expires: 60, path: "/" });

        router.push("/settings");
      } else {
        setError(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <div className="h1_akm ">Login</div>
      <div className="card_akm p-8">
        <div>Log in and provide your address to continue.</div>
        <Spacer y={3} />
        <Input
          value={value}
          id="phone"
          type="text"
          label="Phone"
          variant="bordered"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "success"}
          errorMessage="Please enter a valid 11 digit phone number"
          onValueChange={setValue}
        />
        {isOtpSent && (
          <>
            <p className="text-xs">Enter the 4 digit OTP sent on your phone</p>
            <Input
              value={otp}
              id="otp"
              type="text"
              label="OTP"
              variant="bordered"
              color="success"
              onValueChange={setOtp}
            />
          </>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end items-center mt-4">
          {!isOtpSent ? (
            <ModalButton onPress={handleSendOTP} disabled={isInvalid}>
              Send OTP
            </ModalButton>
          ) : (
            <ModalButton onPress={handleVerifyOTP} disabled={!otp}>
              Verify OTP
            </ModalButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm; // Making LoginForm the default export
