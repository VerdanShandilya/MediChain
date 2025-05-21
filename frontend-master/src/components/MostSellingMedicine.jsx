import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const MostSellingMedicine = ({ chartRef, mostSellingData }) => {
  return (
    <Paper className="p-4 mb-8 shadow-lg">
      <Typography variant="h6" className="mb-4">Most Selling Medicines</Typography>
      <Bar ref={chartRef} data={mostSellingData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Most Selling Medicines' } } }} />
    </Paper>
  );
};

export default MostSellingMedicine;