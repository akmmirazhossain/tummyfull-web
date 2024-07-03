import { useState, useEffect } from "react";
import axios from "axios";

const Deliveries = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost/tf-lara/public/api/delivery")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      {Object.entries(data).map(([date, meals]) => (
        <div key={date} className="mb-4">
          <h2 className="text-xl font-bold mb-2">{date}</h2>
          {/* Sort meal types to ensure lunch is always displayed before dinner */}
          {["lunch", "dinner"].map(
            (mealType) =>
              meals[mealType] && (
                <div key={mealType} className="mb-2">
                  <h3 className="text-lg font-semibold capitalize">
                    {mealType}
                  </h3>
                  <table className="min-w-full border-collapse border border-gray-200 table-auto bg-white">
                    <thead>
                      <tr>
                        <th className="border border-gray-200 p-2">Mealbox</th>
                        <th className="border border-gray-200 p-2">Address</th>
                        <th className="border border-gray-200 p-2">Phone</th>
                        <th className="border border-gray-200 p-2">Name</th>
                        <th className="border border-gray-200 p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals[mealType].map((item, index) => (
                        <tr key={index} className="border border-gray-200">
                          <td className="border border-gray-200 p-2">
                            {item.mrd_order_mealbox}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item.mrd_user_address}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item.mrd_user_phone}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item.mrd_user_first_name}
                          </td>
                          <td className="border border-gray-200 p-2">
                            {item.mrd_order_status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Deliveries;
