// LoginForm.js
import React, { useState, useMemo } from "react";
import { Input, Button as ModalButton } from "@nextui-org/react";
import UserProfileForm from "./UserProfileForm";

const useLoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setModalTitle("Log in");
    setModalContent(<LoginForm onLogin={handleLogin} />);
    setIsLoginModalOpen(true);
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setModalContent(null);
    setModalTitle("");
  };

  return {
    isLoginModalOpen,
    isLoggedIn,
    openLoginModal,
    closeModal,
    modalContent,
    modalTitle,
  };
};

const LoginForm = ({ onLogin }) => {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const {
    isLoginModalOpen,
    isLoggedIn,
    openLoginModal,
    closeModal,
    modalContent,
    modalTitle,
  } = useLoginModal();

  const validatePhoneNumber = (value) => /^(01)\d{9}$/.test(value);
  const isInvalid = useMemo(() => {
    if (value === "") return true;
    return !validatePhoneNumber(value);
  }, [value]);

  const handleSendOTP = async () => {
    if (isInvalid) return;

    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: value }),
        }
      );

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

  const handleVerifyOTP = async (setModalContent) => {
    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: value, otp: otp }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("OTP verification result:", data);

      if (data.status === "success") {
        // Store the session token securely in local storage
        localStorage.setItem("sessionTokenTF", data.token);

        // Set user as logged in
        document.cookie = "isLoggedInTF=true; path=/; secure; samesite=strict";

        // Call onLogin prop to set user as logged in
        onLogin();

        // Set the modal content to UserProfileForm component
        setModalContent(<UserProfileForm />);
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
      {/* <div
        class="flex items-center bg-blue-500 text-white text-sm  px-4 py-3"
        role="alert"
      >
        <p>
          {" "}
          Please login and recharge your TummyFull wallet to enable this order.
        </p>
      </div> */}
      <div className=" text_subheading mb_akm ">Login</div>
      <div>
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
            <ModalButton
              color="primary"
              onPress={handleSendOTP}
              disabled={isInvalid}
            >
              Send OTP
            </ModalButton>
          ) : (
            <ModalButton
              color="primary"
              onPress={handleVerifyOTP}
              disabled={!otp}
            >
              Verify OTP
            </ModalButton>
          )}
        </div>
      </div>
    </div>
  );
};

export { LoginForm, useLoginModal };
