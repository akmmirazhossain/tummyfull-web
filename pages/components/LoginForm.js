// ./components/LoginForm.js
import React, { useState, useEffect, useMemo } from "react";
import { Input, Spacer, Button, Textarea } from "@nextui-org/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Head from "next/head";
import axios from "axios";

const LoginForm = () => {
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [showNameAddrInput, setShowNameAddrInput] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  const [formData, setFormData] = useState({ first_name: "", address: "" });

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

        // Check if new_user is "no"
        if (data.new_user === "yes") {
          setNewUser(true);
          console.log("🚀 ~ handleSendOTP ~ data.new_user:", data.new_user);
        }
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

        //SHOW THE USER NAME & ADDRESS INPUT FIELDS, IF THE USER IS NEW
        if (newUser) {
          setShowNameAddrInput(true);
        } else {
          router.push("/");
        }
        console.log("🚀 ~ handleVerifyOTP ~", newUser);
        // router.push("/settings");
      } else {
        setError(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  //MARK: Name Addr Save

  const handleSaveAndContinue = async () => {
    const token = Cookies.get("TFLoginToken");
    console.log(formData.first_name);

    if (!token) {
      console.error("No login token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}user-update`,
        {
          name: formData.first_name,
          address: formData.address,
          delivery_instruction: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("User data updated successfully:", response.data);

      router.push("/");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  //Handle form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>

      {!showNameAddrInput && (
        <>
          {" "}
          <div className="h1_akm ">Login</div>
          <div className="card_akm p-8">
            <div>Please log in and provide your address to continue.</div>
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
                <p className="text-xs">
                  Enter the 4 digit OTP sent on your phone
                </p>
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
              <>
                {!isOtpSent ? (
                  <Button onPress={handleSendOTP} disabled={isInvalid}>
                    Send OTP
                  </Button>
                ) : (
                  <Button onPress={handleVerifyOTP} disabled={!otp}>
                    Verify OTP
                  </Button>
                )}
              </>
            </div>
          </div>
        </>
      )}

      {/* SHOW THE USER / ADDRESS INPUTS IF THE USER IS NEW */}

      {showNameAddrInput && (
        <>
          <div className="h1_akm ">Welcome!</div>
          <div className="flex flex-col gap_akm card_akm p-8">
            <p>Please enter your name and address to continue.</p>
            <Input
              name="first_name"
              type="text"
              label="User Name"
              variant="bordered"
              value={formData.first_name}
              onChange={handleChange}
              isRequired
            />

            <div>
              {" "}
              <Textarea
                name="address"
                type="text"
                label="Full Address"
                variant="bordered"
                placeholder="Flat no, House no, Road no, Block, Area"
                className=" md:col-span-2"
                value={formData.address}
                onChange={handleChange}
                isRequired
              />
              <p className="h4info_akm mt_akm">
                Our service is currently available only in{" "}
                <span className="font-bold">Bashundhara R/A. </span>
                We will expand to all of Dhaka soon and notify you when we reach
                your area. Stay tuned!{" "}
              </p>
            </div>

            <div className="flex justify-end items-center">
              <Button
                color="success"
                className=""
                onClick={handleSaveAndContinue}
              >
                Save & Continue to Menu
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginForm; // Making LoginForm the default export
