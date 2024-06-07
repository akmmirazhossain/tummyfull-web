import React, { useState } from "react";
import { Input, Button } from "@nextui-org/react";

const UserProfileForm = () => {
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [mealSize, setMealSize] = useState("");

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <div>
      <div className="text_subheading mb_akm">User Profile</div>
      <div>
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          label="User Name"
          variant="bordered"
        />
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Address"
          variant="bordered"
        />
        <Input
          value={mealSize}
          onChange={(e) => setMealSize(e.target.value)}
          label="Meal Size"
          variant="bordered"
        />
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default UserProfileForm;
