// components/ProfileForm.js
import { Button, Input, Spacer, Tooltip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const ProfileForm = () => {
  const router = useRouter();
  const [cookies] = useCookies(["TFLoginToken"]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [config, setConfig] = useState(null);

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = cookies.TFLoginToken;

      if (!config) return;
      const { apiBaseUrl } = config;

      try {
        const response = await fetch(`${apiBaseUrl}user-fetch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data.data.first_name);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        } else {
          setFormData({
            name: data.data.first_name || "",
            phone: data.data.phone || "",
            address: data.data.address || "",
          });
        }

        return data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };

    fetchUserData();
  }, [cookies, router, config]);

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
    const token = cookies.TFLoginToken;

    if (!token) {
      console.error("No login token found, redirecting to login");
      router.push("/login");
      return;
    }

    const { apiBaseUrl } = config;

    try {
      const response = await fetch(`${apiBaseUrl}user-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("User data updated successfully:", result);
        alert("Profile updated successfully!");
        // Optionally, you can refresh or redirect the user
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
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h3 className="text-2xl">Profile Settings</h3>
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
        <Spacer y={1} />
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
        <Spacer y={1} />
        <span>Address</span>
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
        <span className="text-sm">
          (Our service is limited within Bashundhara R/A only, soon we will
          expand all over Dhaka.)
        </span>
        <Spacer y={2} />
        <Button type="submit">Update</Button>
      </form>
    </React.Fragment>
  );
};

export default ProfileForm;
