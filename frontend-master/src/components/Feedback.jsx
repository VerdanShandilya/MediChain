import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch('http://localhost:3000/api/feedback/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Feedback Data:', data);
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedback();
  }, []);

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
  };

  const feedbackData = feedback
    .filter(item => !selectedHospital || item.hospital_name.name === selectedHospital)
    .map(item => ({
      medicineName: item.medicine_name.name,
      sideEffects: item.side_effects,
    }));

  const uniqueMedicines = [...new Set(feedbackData.map(item => item.medicineName))];

  const sideEffectsCount = uniqueMedicines.map(medicine => {
    return feedbackData.filter(item => item.medicineName === medicine).length;
  });

  const sideEffectsMap = uniqueMedicines.reduce((acc, medicine) => {
    acc[medicine] = feedbackData
      .filter(item => item.medicineName === medicine)
      .map(item => item.sideEffects);
    return acc;
  }, {});

  const uniqueHospitals = [...new Set(feedback.map(item => item.hospital_name.name))];

  const data = {
    labels: uniqueMedicines,
    datasets: [
      {
        label: 'Side Effects Count',
        data: sideEffectsCount,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Drug Side Effects',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const medicine = context.label;
            const sideEffects = sideEffectsMap[medicine];
            return sideEffects.map(effect => `• ${effect}`).join('\n');
          }
        }
      }
    },
  };

  return (
    <div>
      <FormControl fullWidth className="mb-4">
        <InputLabel id="hospital-select-label">Select Hospital</InputLabel>
        <Select
          labelId="hospital-select-label"
          value={selectedHospital}
          onChange={handleHospitalChange}
          className="bg-white"
        >
          <MenuItem value="">All Hospitals</MenuItem>
          {uniqueHospitals.map((hospital, index) => (
            <MenuItem key={index} value={hospital}>{hospital}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Line data={data} options={options} />
    </div>
  );
}