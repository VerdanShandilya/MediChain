import  { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Checkbox, FormControlLabel, Select } from '@mui/material';
import 'tailwindcss/tailwind.css';
import Loadar from '../../components/Loadar';
import { parseISO, differenceInMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function AddPatient() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [showExpireSoon, setShowExpireSoon] = useState(false); // Add state for filter checkbox
  const itemsPerPage = 5;
  const [state, setState] = useState('');
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


    if (!name || !age || !phone || !state || medicines.length === 0) {
      setErrorMessage('Please fill all the fields');
      return;
    }



    const purchaseData = {
      patient_name: name,
      patient_phone: phone,
      patient_age: age,
      medicines,
      totalPrice,
      hospital: '66e91632d635b1e1e5604e2c', // Replace with actual hospital ID
      state,
    };

    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      await axios.post('http://localhost:3000/api/purchase', purchaseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      });
      // Handle successful submission (e.g., show a success message, reset form)

      setName('');
      setAge('');
      setPhone('');
      setMedicines([]);
      setQuantities({});
      setTotalPrice(0);
      setState('');
      setErrorMessage('');

      

      alert('Purchase recorded successfully');
      fetchMedicine();
    } catch (error) {
      // Handle error during submission
      alert('Error recording purchase:', error);
    }
  };

  const fetchMedicine = async () => {
    try {
      
            if(!localStorage.getItem('user')){
              navigate('/login');
              return;
            }
      const token=JSON.parse(localStorage.getItem('user')).token;


      const response = await axios.get("http://localhost:3000/api/medicine/", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
      });
      setAvailableMedicines(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching medicines", error);
    } finally {
      setLoading(false); // Data fetched, hide loader
    }
  };

  useEffect(() => {
    fetchMedicine();
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

  const filteredMedicines = availableMedicines.filter((medicine) => {
    const isExpiringSoon = differenceInMonths(parseISO(medicine.expiryDate), new Date()) < 6;
    return medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) && (!showExpireSoon || isExpiringSoon);
  });

  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-5">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Add Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              backgroundColor: "rgb(243 244 246)",
            }
          }}
        />
        <TextField
          label="Age"
          variant="outlined"
          fullWidth
          value={age}
          onChange={(e) => setAge(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              backgroundColor: "rgb(243 244 246)",
            }
          }}
        />
        <TextField
          label="Phone"
          variant="outlined"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              backgroundColor: "rgb(243 244 246)",
            }
          }}
        />

        <select
          id="state"
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 bg-gray-100"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">Select your state</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>

        </select>
        




        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Medicine"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showExpireSoon}
              onChange={(e) => setShowExpireSoon(e.target.checked)}
              color="primary"
            />
          }
          label="Show Expire Soon Medicines"
        />

        {loading ? (
          <div className="flex justify-center mt-10">
            <Loadar /> {/* Show loader when fetching data */}
          </div>
        ) : (
          <>
            <TableContainer className="mt-6 bg-gray-50 rounded-lg shadow-md">
              <Table>
                <TableHead className="bg-gray-200">
                  <TableRow>
                    <TableCell className="font-bold">Medicine</TableCell>
                    <TableCell className="font-bold">Price (Per Pack)</TableCell>
                    <TableCell className="font-bold">Available Quantity</TableCell>
                    <TableCell className="font-bold">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMedicines.map((medicine) => {
                    const expiryDate = parseISO(medicine.expiryDate);
                    const isExpiringSoon = differenceInMonths(expiryDate, new Date()) < 6;

                    return (
                      <TableRow key={medicine._id}>
                        <TableCell>
                          {medicine.name}
                          {isExpiringSoon && (
                            <span className="ml-2 p-1 bg-yellow-200 text-yellow-800 rounded">Expire Soon</span>
                          )}
                        </TableCell>
                        <TableCell>₹{medicine.price}</TableCell>
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
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex justify-center mt-4">
              <Pagination
                count={Math.ceil(filteredMedicines.length / itemsPerPage)}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </div>
          </>
        )}

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
            {errorMessage}
          </div>
        )}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold">Total Price: ₹{totalPrice.toFixed(2)}</h3>
          <ul className="mt-2">
            {medicines.map(({ medicine: medicineId, quantity }) => {
              const medicine = availableMedicines.find((m) => m._id === medicineId);
              const expiryDate = parseISO(medicine.expiryDate);
              const isExpiringSoon = differenceInMonths(expiryDate, new Date()) < 6;

              return (
                <li key={medicineId} className="text-gray-700">
                  {medicine.name}
                  {isExpiringSoon && (
                    <span className="ml-2 p-1 bg-yellow-200 text-yellow-800 rounded">Expire Soon</span>
                  )} - {quantity} units
                </li>
              );
            })}
          </ul>
        </div>
        <Button type="submit" variant="contained" color="primary" className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg">
          Add Patient
        </Button>
      </form>
    </div>
  );
}