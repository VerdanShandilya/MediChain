import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Revenue = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await axios.get('https://medi-chain-9x1d.vercel.app/api/medicine/revenue',{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setRevenueData(response.data);
        console.log('Revenue Data:', response.data);
      } catch (error) {
        console.error('Error fetching revenue data', error);
      }
    };

    fetchRevenueData();
  }, []);

  const transformDataForBarChart = (data) => {
    const labels = data.map(item => item.hospitalName);
    const revenues = data.map(item => item.totalRevenue);
    const dates = data.map(item => new Date(item.date).toLocaleDateString());

    return {
      labels,
      datasets: [{
        label: 'Total Revenue',
        data: revenues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };
  };

  const barChartData = transformDataForBarChart(revenueData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue by Hospital',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Revenue: RS.${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hospital Name',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Revenue',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-5">
      <h2 className="text-3xl font-semibold mb-6 text-center text-black-600">Revenue</h2>
      <Bar data={barChartData} options={options} />
    </div>
  );
};

export default Revenue;