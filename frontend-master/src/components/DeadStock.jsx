import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DeadStock() {
  const [deadStock, setDeadStock] = useState([]);

  useEffect(() => {
    const fetchDeadStock = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user')).token;
        const response = await fetch('http://localhost:3000/api/medicine/deadstock', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await (await response.json()).data;
        console.log('Dead Stock Medicines:', data);
        setDeadStock(data);
      } catch (error) {
        console.error('Error fetching dead stock medicines:', error);
      }
    };

    fetchDeadStock();
  }, []);

  const chartData = {
    labels: deadStock.map(item => item.medicine.name),
    datasets: [
      {
        label: 'Quantity Sold',
        data: deadStock.map(item => item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Dead Stock Medicines</h1>
      <Doughnut data={chartData} />
    </div>
  );
}

export default DeadStock;