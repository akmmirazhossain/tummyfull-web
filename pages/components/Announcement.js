// components/Announcement.js
import React, { useState, useEffect } from "react";
import { Card, Text } from "@nextui-org/react";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.216/tf-lara/public/api/setting"
        );
        const result = await response.json();
        setAnnouncement(result.announcement);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card css={{ p: "$6", mw: "400px" }}>
      <div>{announcement || "Loading..."}</div>
    </Card>
  );
};

export default Announcement;
