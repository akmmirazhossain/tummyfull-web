// components/ProfileForm.js
import { Button, Input, Spacer } from "@nextui-org/react";
import { useState } from "react";
import React from "react";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add form submission logic here
  };

  return (
    <React.Fragment>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <h3 className="text-3xl">User Form</h3>{" "}
        {/* Replacing <Text> with <h3> */}
        <span>Name</span>
        <Input
          clearable
          underlined
          labelPlaceholder="Name"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Spacer y={1} />
        <span>Phone</span>
        <Input
          clearable
          underlined
          labelPlaceholder="Phone"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Spacer y={1} />
        <span>Address</span>
        <Input
          clearable
          underlined
          labelPlaceholder="Address"
          fullWidth
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <Spacer y={2} />
        <Button type="submit">Submit</Button>
      </form>
    </React.Fragment>
  );
};

export default ProfileForm;
