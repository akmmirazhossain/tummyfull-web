// pages/print-values.js

import React from "react";

const PrintValues = () => {
  // Function to print values
  const printValues = () => {
    const newQuantity = Math.max(1, Math.min(5, 5 + -1));

    console.log("QuantityChange -> newQuantity", newQuantity);
  };

  return (
    <div style={{ padding: "20px" }} className="text-black">
      <h1>Print Values Example</h1>
      <button
        onClick={printValues}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Print Values
      </button>
    </div>
  );
};

export default PrintValues;
