import { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orderData, setOrderData] = useState(null);
  const apiUrl = "http://192.168.0.216/tf-lara/public/api/orderlist-chef-now";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">To cook now:</h1>
      {orderData ? (
        <div className="space-y-8">
          {Object.keys(orderData).map((date) => (
            <div key={date}>
              <h2 className="text-xl font-semibold">{date}</h2>
              <p>
                <strong>Day:</strong> {orderData[date].day}
              </p>
              {["lunch", "dinner"].map(
                (period) =>
                  orderData[date][period] && (
                    <div key={period}>
                      <p>
                        <strong>
                          {period.charAt(0).toUpperCase() + period.slice(1)}:
                        </strong>
                      </p>
                      <ul className="list-disc list-inside">
                        {orderData[date][period].food_names.map(
                          (food, index) => (
                            <li key={index}>{food}</li>
                          )
                        )}
                      </ul>
                      <p>
                        <strong>Total Quantity:</strong>{" "}
                        {orderData[date][period].total_quantity}
                      </p>
                    </div>
                  )
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrderList;
