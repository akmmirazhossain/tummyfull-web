import { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orderData, setOrderData] = useState(null);
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
    const fetchData = async () => {
      if (!config) return; // Exit early if config is not yet fetched

      const { apiBaseUrl } = config;
      try {
        const response = await axios.get(`${apiBaseUrl}orderlist-chef-now`);
        setOrderData(response.data);
        console.log("🚀 ~ fetchData ~ response:", response);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, [config]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">To cook now:</h1>
      {orderData ? (
        <div className="space-y-8">
          {Object.keys(orderData).map((date) => (
            <div key={date}>
              <p className="text-xl">{orderData[date].message}</p>
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
