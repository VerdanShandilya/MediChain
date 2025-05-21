import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, MenuItem, Select, FormControl, InputLabel, Grid, Box } from '@mui/material';
import dayjs from 'dayjs';
import MostSellingMedicine from '../../components/MostSellingMedicine';
import LeastSellingMedicine from '../../components/LeastSellingMedicine';
import DeadStock from '../../components/DeadStock';
import Feedback from '../../components/Feedback';
import ExpiryMedicineChart from '../../components/ExpiryMedicine';
import Revenue from '../../components/Revenue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [mostSelling, setMostSelling] = useState([]);
  const [leastSelling, setLeastSelling] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('date');
  const [selectedState, setSelectedState] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [states, setStates] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchMostSelling = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch('https://medi-chain-9x1d.vercel.app/api/medicine/mostselling', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await (await response.json()).data;
        console.log('Most Selling Medicines:', data);
        if (Array.isArray(data)) {
          setMostSelling(data);
          const uniqueHospitals = [...new Set(data.map(item => item.hospital.name))];
          const uniqueStates = [...new Set(data.map(item => item.state))];
          setHospitals(uniqueHospitals);
          setStates(uniqueStates);
        } else {
          console.error('Unexpected data format for most selling medicines:', data);
        }
      } catch (error) {
        console.error('Error fetching most selling medicines:', error);
      }
    };

    const fetchLeastSelling = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch('https://medi-chain-9x1d.vercel.app/api/medicine/leastselling', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await (await response.json()).data;
        console.log('Least Selling Medicines:', data);
        if (Array.isArray(data)) {
          setLeastSelling(data);
        } else {
          console.error('Unexpected data format for least selling medicines:', data);
        }
      } catch (error) {
        console.error('Error fetching least selling medicines:', error);
      }
    };

    fetchMostSelling();
    fetchLeastSelling();
  }, []);

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const handleTimeFilterChange = (event) => {
    setSelectedTimeFilter(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const filterByTime = (medicines) => {
    const now = dayjs();
    return medicines.filter(item => {
      const purchaseDate = dayjs(item.purchaseDate);
      if (selectedTimeFilter === 'date') {
        return purchaseDate.isSame(now, 'day');
      } else if (selectedTimeFilter === 'week') {
        return purchaseDate.isSame(now, 'week');
      } else if (selectedTimeFilter === 'month') {
        return purchaseDate.isSame(now, 'month');
      }
      return true;
    });
  };

  const aggregateMedicines = (medicines) => {
    const medicineMap = new Map();
    medicines.forEach(item => {
      const medicineName = item.medicine.medicine.name;
      const quantity = item.medicine.quantity;
      if (medicineMap.has(medicineName)) {
        medicineMap.set(medicineName, medicineMap.get(medicineName) + quantity);
      } else {
        medicineMap.set(medicineName, quantity);
      }
    });
    return Array.from(medicineMap, ([name, quantity]) => ({ name, quantity }));
  };

  const filteredMostSelling = filterByTime(
    selectedHospital || selectedState
      ? mostSelling.filter(item => 
          (selectedHospital ? item.hospital.name === selectedHospital : true) &&
          (selectedState ? item.state === selectedState : true)
        )
      : mostSelling
  );

  const filteredLeastSelling = filterByTime(
    selectedHospital || selectedState
      ? leastSelling.filter(item => 
          (selectedHospital ? item.hospital.name === selectedHospital : true) &&
          (selectedState ? item.state === selectedState : true)
        )
      : leastSelling
  );

  const aggregatedMostSelling = aggregateMedicines(filteredMostSelling).sort((a, b) => b.quantity - a.quantity);
  const aggregatedLeastSelling = aggregateMedicines(filteredLeastSelling).sort((a, b) => a.quantity - b.quantity);

  const mostSellingData = {
    labels: aggregatedMostSelling.map(item => item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: aggregatedMostSelling.map(item => item.quantity),
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // New color
        borderColor: 'rgba(54, 162, 235, 1)', // New color
        borderWidth: 1,
      },
    ],
  };

  const leastSellingData = {
    labels: aggregatedLeastSelling.map(item => item.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: aggregatedLeastSelling.map(item => item.quantity),
        backgroundColor: 'rgba(255, 159, 64, 0.2)', // New color
        borderColor: 'rgba(255, 159, 64, 1)', // New color
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container className="mt-8">
      <Typography variant="h4" className="mb-4 pb-6 text-center text-blue-600">Admin Dashboard</Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth className="mb-4">
            <InputLabel id="time-filter-select-label">Select Time Filter</InputLabel>
            <Select
              labelId="time-filter-select-label"
              value={selectedTimeFilter}
              onChange={handleTimeFilterChange}
              className="bg-white"
            >
              <MenuItem value="date">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
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
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth className="mb-4">
            <InputLabel id="state-select-label">Select State</InputLabel>
            <Select
              labelId="state-select-label"
              value={selectedState}
              onChange={handleStateChange}
              className="bg-white"
            >
              <MenuItem value="">All States</MenuItem>
              {states.map((state, index) => (
                <MenuItem key={index} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-96 border border-gray-300 m-4">
            <Box className="h-full w-full p-4">
              <MostSellingMedicine chartRef={chartRef} mostSellingData={mostSellingData} />
            </Box>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-96 border border-gray-300 m-4">
            <Box className="h-full w-full p-4">
              <LeastSellingMedicine chartRef={chartRef} leastSellingData={leastSellingData} />
            </Box>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-auto border border-gray-300 m-4">
            <Box className="h-auto w-full p-4">
              <DeadStock />
            </Box>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-auto border border-gray-300 m-4">
            <Box className="h-auto w-full p-4">
              <ExpiryMedicineChart />
            </Box>
          </div>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-96 border border-gray-300 m-4">
            <Box className="h-full w-full p-4">
              <Revenue />
            </Box>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className="bg-white p-4 rounded-lg shadow-md h-96 border border-gray-300 m-4">
            <Box className="h-full w-full p-4">
              <Feedback />
            </Box>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}