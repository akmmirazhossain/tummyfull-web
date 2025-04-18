// components/ProfileForm.js
import { Button, Input, Spacer, Textarea } from "@nextui-org/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import Link from "next/link";
import { ApiContext } from "../contexts/ApiContext";
import { useUser } from "../contexts/UserContext";

const ProfileForm = () => {
  const router = useRouter();
  const apiConfig = useContext(ApiContext);
  const { refreshUser } = useUser();
  const [no_address, setNoAddress] = useState("");

  useEffect(() => {
    if (router.query.no_address) {
      setNoAddress(router.query.no_address); // Extract message from query params
    }
  }, [router.query.no_address]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    delivery_instruction: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("TFLoginToken");
      if (!apiConfig) return;
      try {
        const response = await fetch(`${apiConfig.apiBaseUrl}user-fetch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("🚀 ~ fetchUserData ~ data:", data);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        } else {
          setFormData({
            name: data.data.first_name || "",
            phone: data.data.phone || "",
            address: data.data.address || "",
            delivery_instruction: data.data.delivery_instruction || "",
            user_type: data.data.user_type || "",
          });
        }

        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    fetchUserData();
  }, [apiConfig]);

  // Function to fetch user data using the token

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("TFLoginToken");

    if (!token) {
      console.error("No login token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`${apiConfig.apiBaseUrl}user-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          delivery_instruction: formData.delivery_instruction,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User data updated successfully:", result);
        alert("Profile updated successfully!");
        await refreshUser();
      } else {
        console.error("Failed to update user data:", result);
        alert(result.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <div className="h1_akm ">Profile Settings</div>
      <form onSubmit={handleSubmit} className="card_akm p-8">
        <div>
          {" "}
          {formData.user_type === "chef" && (
            <div className=" flex flex-col gap_akm">
              <div> আপনি একজন শেফ হিসাবে লগ ইন করেছেন।</div>
              <div>
                {" "}
                <Link href="/chef">
                  <Button size="lg" color="success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="100"
                      height="100"
                    >
                      <path d="M240 144A96 96 0 1 0 48 144a96 96 0 1 0 192 0zm44.4 32C269.9 240.1 212.5 288 144 288C64.5 288 0 223.5 0 144S64.5 0 144 0c68.5 0 125.9 47.9 140.4 112l71.8 0c8.8-9.8 21.6-16 35.8-16l104 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-104 0c-14.2 0-27-6.2-35.8-16l-71.8 0zM144 80a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM400 240c13.3 0 24 10.7 24 24l0 8 96 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-240 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l96 0 0-8c0-13.3 10.7-24 24-24zM288 464l0-112 224 0 0 112c0 26.5-21.5 48-48 48l-128 0c-26.5 0-48-21.5-48-48zM48 320l80 0 16 0 32 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-16 0c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-80c0-8.8 7.2-16 16-16zm128 64c8.8 0 16-7.2 16-16s-7.2-16-16-16l-16 0 0 32 16 0zM24 464l176 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 512c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                    </svg>
                    শেফ প্যানেল ভিজিট করুন
                  </Button>
                </Link>
              </div>
              <Spacer y={4} />
            </div>
          )}
          {formData.user_type === "delivery" && (
            <div className=" flex flex-col gap_akm ">
              <div> আপনি ডেলিভারি পার্সন হিসেবে লগ ইন করেছেন।</div>
              <div className="flex gap_akm flex-col md:flex-row">
                <Link href="/delivery" target="_blank">
                  <Button size="lg" color="secondary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e8eaed"
                    >
                      <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120ZM360-540Z" />
                    </svg>
                    ডেলিভারি প্যানেলে ভিজিট করুন
                  </Button>
                </Link>
                <Link href="https://youtu.be/IrbJKfHFEns" target="_blank">
                  <Button size="lg" color="success">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                    >
                      <path d="m590-488 160-92-160-92-160 92 160 92Zm0 122 110-64v-84l-110 64-110-64v84l110 64ZM480-480Zm320 320H600q0-20-1.5-40t-4.5-40h206v-480H160v46q-20-3-40-4.5T80-680v-40q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160Zm-720 0v-120q50 0 85 35t35 85H80Zm200 0q0-83-58.5-141.5T80-360v-80q117 0 198.5 81.5T360-160h-80Zm160 0q0-75-28.5-140.5t-77-114q-48.5-48.5-114-77T80-520v-80q91 0 171 34.5T391-471q60 60 94.5 140T520-160h-80Z" />
                    </svg>
                    টিউটোরিয়াল দেখুন
                  </Button>
                </Link>
              </div>
              <Spacer y={4} />
            </div>
          )}
        </div>
        <span>Name</span>
        <Input
          clearable
          required
          underlined
          variant="bordered"
          placeholder="Your full name"
          labelPlaceholder="Name"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Spacer y={4} />
        <div className="flex items-center">
          <span>Phone</span>

          <div className="lg:tooltip" data-tip="Phone number verified">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className=" text-green-600 ml-1"
            />
          </div>
        </div>
        <Input
          labelPlaceholder="Phone"
          variant="bordered"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled // Phone field is disabled since it is not being updated
        />
        <Spacer y={4} />
        <div>
          <span>Address </span>
          <span className="text-red-500">
            {" "}
            {no_address && <> ({no_address})</>} *
          </span>
        </div>
        <div>
          <span className="pl_akm text-xs text_grey">
            Flat no, Lift floor, House no, Road no, Block, Area
          </span>
        </div>
        <Input
          clearable
          required
          variant="bordered"
          underlined
          labelPlaceholder="Address"
          placeholder="Flat no, Lift floor, House no, Road no, Block, Area
"
          fullWidth
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <span className="h4info_akm">
          Our service is currently available only in{" "}
          <span className="font-bold">Bashundhara R/A</span>. We’re expanding
          across Dhaka soon and will notify you once we reach your area. Kindly
          provide your address to receive updates.
        </span>
        <Spacer y={4} />

        <div>
          <span>Delivery Guidelines </span>
        </div>
        <Textarea
          label=""
          variant="bordered"
          placeholder="Guidelines for Our Delivery Personnel"
          className="max-w-sm"
          name="delivery_instruction"
          value={formData.delivery_instruction}
          onChange={handleChange}
          address
        />

        <Spacer y={3} />

        <div>
          <div></div>
          <div></div>
        </div>
        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </>
  );
};

export default ProfileForm;
