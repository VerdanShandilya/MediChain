import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Addmedicine = () => {
  const [formData, setFormData] = useState({
    medicineName: "",
    expiryDate: "",
    quantity: "",
    price: "",
    manufacture: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const obj = {
      name: formData.medicineName,
      quantity: formData.quantity,
      price: formData.price,
      expiryDate: formData.expiryDate,
      manufacturer: formData.manufacture,
      description: formData.description,
    };

    if (
      !obj.name ||
      !obj.quantity ||
      !obj.price ||
      !obj.expiryDate ||
      !obj.manufacturer
    ) {
      alert("Please fill all the fields");
      return;
    }

    const token = JSON.parse(localStorage.getItem("user")).token;
    if (JSON.parse(localStorage.getItem("user")).type !== "Vendor") {
      alert("You are not authorized to add medicine");
      return;
    }
    if (!token) {
      alert("You are not authorized to add medicine");
      return;
    }

    try {
      const data = await axios.post(
        "http://localhost:3000/api/medicine/create",
        obj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 200) {
        alert("Medicine added successfully");
        setFormData({
          medicineName: "",
          expiryDate: "",
          quantity: "",
          price: "",
          manufacture: "",
          description: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg max-w-lg mt-10 transform transition duration-500 hover:scale-105">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add New Medicine
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Medicine Name */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Medicine Name:
          </label>
          <input
            type="text"
            name="medicineName"
            value={formData.medicineName}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Enter medicine name"
            required
          />
        </div>

        {/* Expiry Date */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Expiry Date:
          </label>
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            required
          />
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Quantity:
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Enter quantity"
            min="1"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Price:
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Manufacture */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Manufacture:
          </label>
          <input
            type="text"
            name="manufacture"
            value={formData.manufacture}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Enter manufacture name"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Enter description"
            rows="4"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addmedicine;
