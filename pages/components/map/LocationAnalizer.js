// components/ProfileForm.js
import React, { useRef } from "react";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router"; // Import useRouter

import Head from "next/head";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";
import ReverseGeocodingMap from "./map/ReverseGeocodingMap";
import { useSnackbar } from "./ui/Snackbar";
import GeolocationTracker from "./map/GeolocationTracker";

const LocationAnalizer = () => {
  const router = useRouter();
  const { user, loadingUser, error, isLoggedIn, refreshUser, loginToken } =
    useUser();
  const [no_address, setNoAddress] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    delivery_instruction: "",
    user_type: "",
    userLatitude: null, // Start with null
    userLongitude: null,
  });
  const mapRef = useRef(null);
  const [addressMapData, setAddressMapData] = useState("");
  const [mapClicked, setMapClicked] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [fromGeoTracker, setFromGeoTracker] = useState(false);

  useEffect(() => {
    if (!loadingUser) {
      // wait until user is loaded
      if (user?.data) {
        setFormData({
          name: user.data.first_name || "",
          phone: user.data.phone || "",
          address: user.data.address || "",
          delivery_instruction: user.data.delivery_instruction || "",
          user_type: user.data.user_type || "",
          userLatitude: user.data.userLatitude || "",
          userLongitude: user.data.userLongitude || "",
        });
      }
    }
  }, [loadingUser, user]);

  useEffect(() => {
    if (mapClicked && addressMapData) {
      console.log("MAP CLICKED: updating address with latest data");
      setFromGeoTracker(false);
      setFormData((prev) => ({
        ...prev,
        address: addressMapData.formatted,
        userLatitude: addressMapData.lat,
        userLongitude: addressMapData.lon,
      }));
    }
  }, [mapClicked, addressMapData]);

  //Refresh user data when redirected from login page
  useEffect(() => {
    if (router.isReady && router.asPath === "/settings") {
      refreshUser();
    }
  }, [router.isReady]);

  const handleAddressChange = (data) => {
    setAddressMapData(data);
  };

  //Handle Geolocation Update
  const handleGeoLocationUpdate = (location) => {
    console.log("📍 Location from GeolocationTracker:", location);
    setFromGeoTracker(true);
    setFormData((prev) => ({
      ...prev,
      userLatitude: location.lat,
      userLongitude: location.lng,
    }));
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

    //if map click, and lat

    if (fromGeoTracker) {
      showSnackbar("Please pin the delivery address on the map", "warning");
      return;
    }
    console.log("ProfileForm.js ->", formData.userLatitude);

    if (!loginToken) {
      console.error("No login token found, redirecting to login");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            delivery_instruction: formData.delivery_instruction,
            userLatitude: formData.userLatitude,
            userLongitude: formData.userLongitude,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showSnackbar("Profile Updated Successfully!", "success");
        await refreshUser();
      } else {
        console.error("Failed to update user data:", result);
        showSnackbar("Failed to update profile. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      showSnackbar("Failed to update profile. Please try again.", "error");
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <div className="h1_akm ">Profile Settings</div>
      <form onSubmit={handleSubmit} className="p-8 card_akm">
        <div>
          {" "}
          {formData.user_type === "chef" && (
            <div className="flex flex-col gap_akm">
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
            <div className="flex flex-col gap_akm">
              <div> আপনি ডেলিভারি পার্সন হিসেবে লগ ইন করেছেন।</div>
              <div className="flex flex-col gap_akm md:flex-row">
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
              className="ml-1 text-green-600 "
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

        <div className="justify-center flex-none lg:flex gap_akm">
          <div className="lg:w-1/2">
            <div>
              <span>Delivery Address </span>
              <span className="text-red-500">*</span>
            </div>
            <div>
              <span className="text-xs pl_akm text_grey">
                Flat no, Lift floor, House no, Road no, Block, Area
              </span>
            </div>
            {/* //MARK: Address*/}
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

            {!loadingUser &&
              (formData.userLatitude && formData.userLongitude ? (
                <ReverseGeocodingMap
                  initialLat={parseFloat(formData.userLatitude)}
                  initialLon={parseFloat(formData.userLongitude)}
                  onAddressChange={handleAddressChange}
                  mapClicked={setMapClicked}
                  mapRef={mapRef}
                />
              ) : (
                <GeolocationTracker
                  useGoogleAPI={true}
                  onGeoLocationUpdate={handleGeoLocationUpdate}
                />
              ))}

            <Spacer y={4} />
          </div>
          <div className="lg:w-1/2">
            {" "}
            <div
              ref={mapRef}
              className="w-full mb-6 border-gray-300 rounded-lg h-96 border-1"
            />
          </div>
        </div>

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

        <Button type="submit" size="lg">
          Update Profile
        </Button>
      </form>
    </>
  );
};

export default ProfileForm;
