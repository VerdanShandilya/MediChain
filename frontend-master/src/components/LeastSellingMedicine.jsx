import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const LeastSellingMedicine = ({ chartRef, leastSellingData }) => {
  return (
    <Paper className="p-4 mb-8 shadow-lg">
      <Typography variant="h6" className="mb-4">Least Selling Medicines</Typography>
      <Bar ref={chartRef} data={leastSellingData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Least Selling Medicines' } } }} />
    </Paper>
  );
};

export default LeastSellingMedicine;