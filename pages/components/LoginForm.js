// ./components/LoginForm.js
import React, { useState, useMemo } from "react";
import { Input, Button as ModalButton } from "@nextui-org/react";

const LoginForm = () => {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const validatePhoneNumber = (value) => /^(01)\d{9}$/.test(value);
  const isInvalid = useMemo(() => {
    if (value === "") return true;
    return !validatePhoneNumber(value);
  }, [value]);

  //MARK: SendOTP
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

  //MARK: VerifyOTP
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
        // Set user as logged in
        document.cookie = `TFLoginToken=${data.token}; path=/; secure; samesite=strict`;
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

export default LoginForm; // Making LoginForm the default export
