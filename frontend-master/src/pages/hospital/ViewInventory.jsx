import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from '@mui/material';
import { parseISO, differenceInMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Loadar from '../../components/Loadar';
import 'tailwindcss/tailwind.css';

export default function ViewInventory() {
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showExpireSoon, setShowExpireSoon] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchMedicine = async () => {
    try {
      if (!localStorage.getItem('user')) {
        navigate('/login');
        return;
      }
      const token = JSON.parse(localStorage.getItem('user')).token;

      const response = await axios.get("https://medichain-0usn.onrender.com/api/medicine/", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setAvailableMedicines(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching medicines", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, []);

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
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">View Inventory</h2>
      <div className="relative mb-4">
        <TextField
          label="Search Medicine"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
              backgroundColor: "rgb(243 244 246)",
            }
          }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loadar />
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
                  <TableCell className="font-bold">Expiry Date</TableCell>
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
                      <TableCell>{medicine.expiryDate}</TableCell>
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
              className="bg-white rounded-lg shadow-md"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#1D4ED8", // Tailwind blue-700
                },
                "& .Mui-selected": {
                  backgroundColor: "#1D4ED8", // Tailwind blue-700
                  color: "#FFFFFF", // White
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}