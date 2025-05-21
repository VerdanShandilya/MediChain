import  { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, MenuItem, Select, InputLabel, FormControl, CircularProgress } from '@mui/material';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

export default function AddPatient() {
  const [medicines, setMedicines] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  const itemsPerPage = 5;
  const navigate = useNavigate();

  const handleQuantityChange = (medicineId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [medicineId]: quantity,
    }));

    const existingMedicine = medicines.find((m) => m.medicine === medicineId);
    if (existingMedicine) {
      setMedicines((prev) =>
        prev.map((m) =>
          m.medicine === medicineId ? { ...m, quantity } : m
        )
      );
    } else {
      setMedicines((prev) => [...prev, { medicine: medicineId, quantity }]);
    }

    if (quantity === 0) {
      setMedicines((prev) => prev.filter((m) => m.medicine !== medicineId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any quantity exceeds the available quantity
    for (const { medicine: medicineId, quantity } of medicines) {
      const medicine = availableMedicines.find((m) => m._id === medicineId);
      if (medicine && quantity > medicine.quantity) {
        setErrorMessage(`Quantity for ${medicine.name} cannot exceed ${medicine.quantity}`);
        return;
      }
    }
    setErrorMessage('');

    const purchaseData = {
      medicines,
      "received_hospital": selectedHospital,
      "vendor":"66e92291b11ad11459370b65",
      "shipment_date":Date.now(),
      "total_cost":totalPrice
    };
    // console.log(purchaseData);

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const response = await axios.post('http://localhost:3000/api/shipment/create', purchaseData,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log(response.data);

      setMedicines([]);
      setQuantities({});
      setTotalPrice(0);



      alert('Shipment created successfully  ' + response.data.shipment_number);
      fetchMedicine();
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchMedicine = async () => {
    setLoadingMedicines(true);
    // console.log(token);
    console.log(localStorage.getItem('user'));
    
    if (!localStorage.getItem('user')) {
      navigate('/login');
      return;
    }
    const token = JSON.parse(localStorage.getItem('user')).token;
    try {
      const response = await axios.get("http://localhost:3000/api/medicine/getAll", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAvailableMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoadingMedicines(false);
    }
  };

  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    try {
      const response = await axios.get("http://localhost:3000/api/hospital/getAll");
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoadingHospitals(false);
    }
  };

  useEffect(() => {
    fetchMedicine();
    fetchHospitals();
  }, []);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      medicines.forEach(({ medicine: medicineId, quantity }) => {
        const medicine = availableMedicines.find((m) => m._id === medicineId);
        if (medicine) {
          total += medicine.price * quantity;
        }
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [medicines, quantities, availableMedicines]);

  const filteredMedicines = availableMedicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Dispatch Medicine
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormControl fullWidth variant="outlined" className="mb-4">
          <InputLabel id="hospital-select-label">Select Hospital</InputLabel>
          <Select
            labelId="hospital-select-label"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            label="Select Hospital"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
                backgroundColor: "rgb(243 244 246)",
              }
            }}
          >
            {hospitals.map((hospital) => (
              <MenuItem key={hospital._id} value={hospital._id}>
                {hospital.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Medicine"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
        {loadingMedicines ? (
          <div className="flex justify-center items-center mt-6">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer className="mt-6 bg-gray-50 rounded-lg shadow-md">
            <Table>
              <TableHead className="bg-gray-200">
                <TableRow>
                  <TableCell className="font-bold">Medicine</TableCell>
                  <TableCell className="font-bold">Price(Per Pack)</TableCell>
                  <TableCell className="font-bold">Available Quantity</TableCell>
                  <TableCell className="font-bold">Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMedicines.map((medicine) => (
                  <TableRow key={medicine._id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>Rs.{medicine.price}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={quantities[medicine._id] || ''}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value, 10);
                          handleQuantityChange(medicine._id, quantity);
                        }}
                        inputProps={{ min: 0, max: medicine.quantity }}
                        className="w-20 bg-gray-100 rounded-lg"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <div className="flex justify-center mt-4">
          <Pagination
            count={Math.ceil(filteredMedicines.length / itemsPerPage)}
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
            color="primary"
          />
        </div>
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
            {errorMessage}
          </div>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold">Total Price: Rs.{totalPrice.toFixed(2)}</h3>
          <ul className="mt-2">
            {medicines.map(({ medicine: medicineId, quantity }) => {
              const medicine = availableMedicines.find((m) => m._id === medicineId);
              return (
                <li key={medicineId} className="text-gray-700">
                  {medicine.name} - {quantity} units
                </li>
              );
            })}
          </ul>
        </div>

        <Button type="submit" variant="contained" color="primary" className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg">
          Dispatch
        </Button>
      </form>
    </div>
  );
}