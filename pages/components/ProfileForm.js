// components/ProfileForm.js
import { Button, Input, Spacer, Tooltip, Textarea } from "@nextui-org/react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { ApiContext } from "../contexts/ApiContext";

const ProfileForm = () => {
  const router = useRouter();
  const apiConfig = useContext(ApiContext);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    delivery_instruction: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("TFLoginToken");
      console.log("fetchUserData -->".token);

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

  const checkAndRedirect = () => {
    const token = Cookies.get("TFLoginToken");
    if (!token) {
      router.push("/login"); // Redirect to login page if the cookie is not available
    } else {
      console.log("MealSettings: checkAndRedirect -> Token found");
    }
  };

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
        alert(
          "Profile updated successfully! \nRedirecting you to the menu page to place your order."
        );

        router.push("/");
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
        <span>Name</span>
        <Input
          clearable
          required
          underlined
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
          <Tooltip color="foreground" content="Phone number verified">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-md text-green-600 ml-1"
            />
          </Tooltip>
        </div>
        <Input
          labelPlaceholder="Phone"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled // Phone field is disabled since it is not being updated
        />
        <Spacer y={4} />
        <div>
          <span>Address </span>
          <span className="text-red-500">*</span>
        </div>
        <Input
          clearable
          required
          underlined
          labelPlaceholder="Address"
          placeholder="Flat no, House no, Road no, Block"
          fullWidth
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <span className="h4info_akm">
          Our service is currently available only in Bashundhara R/A. We will
          expand to all of Dhaka soon and notify you when we reach your area.
          Stay tuned!
        </span>
        <Spacer y={4} />

        <div>
          <span>Delivery Guidelines </span>
        </div>
        <Textarea
          label=""
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
          Save & Continue to Menu
        </Button>
      </form>
    </>
  );
};

export default ProfileForm;
