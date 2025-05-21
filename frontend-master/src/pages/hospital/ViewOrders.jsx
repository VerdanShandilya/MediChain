import  { useEffect, useState } from "react";
import Loadar from "../../components/Loadar"; // Assuming you have a Loadar component
import { useNavigate } from "react-router-dom";
const ViewOrders = () => {
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for details
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
      return;
    }

    const token = JSON.parse(localStorage.getItem("user")).token;

    try {
      const response = await fetch("https://medi-chain-9x1d.vercel.app/api/purchase", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setOrders(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching orders: ", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="relative">
      {/* Main Content with a slight Blur Effect When Modal is Open */}
      <div
        className={`container mx-auto p-4 transition-all duration-300 ${
          selectedOrder ? "blur-sm opacity-90" : ""
        }`}
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Patient Orders
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <tr>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Phone
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Age
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Total Price
                </th>
                <th className="py-4 px-6 text-sm font-semibold text-left uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-6 px-6 text-center text-gray-500"
                  >
                    <Loadar /> {/* Loader component shown while loading */}
                  </td>
                </tr>
              ) : (
                orders &&
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-800">
                      {order.patient_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.patient_phone}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.patient_age}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      Rs.{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600">
                      <button
                        className="text-blue-600 hover:text-blue-900 underline font-semibold"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Order Details
            </h2>
            <p className="mb-2">
              <strong className="font-semibold text-gray-700">
                Patient Name:
              </strong>{" "}
              {selectedOrder.patient_name}
            </p>
            <p className="mb-2">
              <strong className="font-semibold text-gray-700">Phone:</strong>{" "}
              {selectedOrder.patient_phone}
            </p>
            <p className="mb-2">
              <strong className="font-semibold text-gray-700">Age:</strong>{" "}
              {selectedOrder.patient_age}
            </p>
            <p className="mb-4">
              <strong className="font-semibold text-gray-700">
                Purchase Date:
              </strong>{" "}
              {new Date(selectedOrder.purchaseDate).toLocaleDateString()}
            </p>
            <p className="mb-4">
              <strong className="font-semibold text-gray-700">
                Total Price:
              </strong>{" "}
              Rs.{selectedOrder.totalPrice.toFixed(2)}
            </p>

            <h3 className="text-xl font-bold mb-4">Medicines</h3>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              {selectedOrder.medicines.map((med) => (
                <li key={med._id}>
                  {med.medicine.name} (Qty: {med.quantity})
                </li>
              ))}
            </ul>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
