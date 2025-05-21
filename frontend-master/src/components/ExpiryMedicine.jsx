import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, FormControl, InputLabel, Select, MenuItem, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpiryMedicineChart = () => {
  const [expiryData, setExpiryData] = useState({
    nearbyExpiryMedicines: [],
    expiredMedicines: [],
    normalMedicines: []
  });
  const [selectedHospital, setSelectedHospital] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExpiryData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch('http://localhost:3000/api/medicine/categorywise', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Expiry Medicines Data:', data);
        setExpiryData(data);

        // Extract unique hospitals from the data
        const uniqueHospitals = [
          ...new Set(
            data.nearbyExpiryMedicines
              .concat(data.expiredMedicines)
              .concat(data.normalMedicines)
              .map(item => item.hospital.name)
          )
        ];
        setHospitals(uniqueHospitals);
      } catch (error) {
        console.error('Error fetching expiry medicines data:', error);
      }
    };

    fetchExpiryData();
  }, []);

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const filterDataByHospital = (data, hospital) => {
    if (!hospital) return data;
    return data.filter(item => item.hospital.name === hospital);
  };

  const filteredNearbyExpiry = filterDataByHospital(expiryData.nearbyExpiryMedicines, selectedHospital);
  const filteredExpired = filterDataByHospital(expiryData.expiredMedicines, selectedHospital);
  const filteredNormal = filterDataByHospital(expiryData.normalMedicines, selectedHospital);

  const doughnutData = {
    labels: ['Nearby Expiry Medicines', 'Expired Medicines', 'Normal Medicines'],
    datasets: [
      {
        data: [
          filteredNearbyExpiry.length,
          filteredExpired.length,
          filteredNormal.length
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      const index = elements[0].index;
      let selectedData = [];
      let category = '';
      if (index === 0) {
        selectedData = filteredNearbyExpiry;
        category = 'Nearby Expiry Medicines';
      } else if (index === 1) {
        selectedData = filteredExpired;
        category = 'Expired Medicines';
      } else if (index === 2) {
        selectedData = filteredNormal;
        category = 'Normal Medicines';
      }
      if (selectedData && selectedData.length > 0) {
        setSelectedMedicines(selectedData);
        setSelectedCategory(category);
        setOpen(true);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMedicines = selectedMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="h-full w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Expiry Medicines Distribution</h2>
      <FormControl fullWidth className="mb-4">
        <InputLabel id="hospital-select-label">Select Hospital</InputLabel>
        <Select
          labelId="hospital-select-label"
          value={selectedHospital}
          onChange={handleHospitalChange}
          className="bg-white"
        >
          <MenuItem value="">All Hospitals</MenuItem>
          {hospitals.map((hospital, index) => (
            <MenuItem key={index} value={hospital}>{hospital}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Doughnut
          data={doughnutData}
          options={{
            onClick: (event, elements) => handleChartClick(event, elements)
          }}
          className='w-full h-full pb-9'
        />
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">{selectedCategory} Details</h2>
          <TextField
            label="Search Medicines"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Quantity</TableCell>
                  <TableCell className="font-bold">Price</TableCell>
                  <TableCell className="font-bold">Expiry Date</TableCell>
                  <TableCell className="font-bold">Hospital Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMedicines.map((medicine) => (
                  <TableRow key={medicine._id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell>{medicine.price}</TableCell>
                    <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{medicine.hospital.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
};

export default ExpiryMedicineChart;