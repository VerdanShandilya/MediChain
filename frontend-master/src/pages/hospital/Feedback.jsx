import React, { useState } from "react";
import axios from "axios";
import { Select, MenuItem } from "@mui/material";

const Feedback = () => {
  const [formData, setFormData] = useState({
    symptoms: "",
    sideEffects: "",
  });
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");

  const [hospitals, setHospitals] = useState([]);
  const [medicines, setMedicines] = useState([]);

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
    console.log(selectedHospital);
    console.log(selectedMedicine);

    try {
      const data = await axios.post("http://localhost:3000/api/feedback/create", {
        symptoms: formData.symptoms,
        side_effects: formData.sideEffects,
        hospital_name: selectedHospital,
        medicine_name: selectedMedicine,
      });
      console.log(data);
      alert("Feedback submitted successfully!");

      setFormData({
        symptoms: "",
        sideEffects: "",
      });
      setSelectedHospital("");
      setSelectedMedicine("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/hospital/getAll");
      setHospitals(response.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchMedicine = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const response = await axios.get("http://localhost:3000/api/medicine/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  React.useEffect(() => {
    fetchHospitals();
    fetchMedicine();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-white shadow-2xl rounded-lg max-w-lg mt-10 transform transition duration-500 hover:scale-105">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Medicine Feedback Form
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Medicine Information */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Medicine Name:
          </label>
          <Select
            labelId="medicine-select-label"
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                backgroundColor: "rgb(243 244 246)",
              },
              width: "100%",
            }}
          >
            {medicines.map((medicine) => (
              <MenuItem key={medicine._id} value={medicine._id}>
                {medicine.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Hospital Information */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Hospital Name:
          </label>
          <Select
            labelId="hospital-select-label"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                backgroundColor: "rgb(243 244 246)",
              },
              width: "100%",
            }}
          >
            {hospitals.map((hospital) => (
              <MenuItem key={hospital._id} value={hospital._id}>
                {hospital.name}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Symptoms */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Symptoms Experienced:
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Describe the symptoms experienced"
            rows="4"
          />
        </div>

        {/* Side Effects */}
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2 text-gray-700">
            Side Effects:
          </label>
          <textarea
            name="sideEffects"
            value={formData.sideEffects}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
            placeholder="Describe any side effects"
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

export default Feedback;
