// components/ProfileForm.js
import { Button, Input, Spacer, Tooltip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import React from "react";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// Function to fetch user data using the token
const fetchUserData = async (token) => {
  try {
    const response = await fetch(
      "http://192.168.0.216/tf-lara/public/api/user-fetch",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const ProfileForm = () => {
  const router = useRouter();
  const [cookies] = useCookies(["TFLoginToken"]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      const token = cookies.TFLoginToken;
      if (!token) {
        router.push("/login"); // Redirect to login if no token
        return;
      }

      const userData = await fetchUserData(token);
      if (userData && userData.status === "success") {
        setFormData({
          name: userData.data.first_name || "",
          phone: userData.data.phone || "",
          address: userData.data.address || "",
        });
      }
    };

    loadUserData();
  }, [cookies, router]);

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

    try {
      const response = await fetch(
        "http://192.168.0.216/tf-lara/public/api/user-update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
          }),
        }
      );

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
