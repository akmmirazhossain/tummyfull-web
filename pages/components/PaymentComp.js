// components/PaymentComp.js

import { Container, Row, Text } from "@nextui-org/react";

const PaymentComp = () => {
  return (
    <div>
      <div css={{ marginBottom: "20px" }}>
        <div className="w-100 border m-6 p-6">Cash on delivery</div>
        {/* Add your first row content here */}
      </div>
      <div>
        <div className="m-6 border p-6">Online Payment</div>
        {/* Add your second row content here */}
      </div>
    </div>
  );
};

export default PaymentComp;
