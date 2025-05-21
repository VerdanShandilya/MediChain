import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import 'tailwindcss/tailwind.css';
import axios from 'axios';

export default function AcceptShipment() {
  const [shipmentNo, setShipmentNo] = useState('');

  const handleSubmit = async() => {
    console.log('Shipment No:', shipmentNo);
    if(confirm('Are you sure you want to accept this shipment?')) {
      try {

        const token=JSON.parse(localStorage.getItem('user')).token;

        const data=await axios.post("http://localhost:3000/api/medicine/accept", {
            shipmentNo,
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(data.status===200){
            alert('Shipment accepted successfully');
          
        }
        else{
            alert('An error occurred. Please try again later.');
            console.log(data);
            
        }


      } catch (error) {
        console.error('Error accepting shipment: ', error);
        alert('An error occurred. Please try again later.');
      }
    }



    // Add your submission logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Accept Medicine</h1>
      <TextField
        label="Enter Shipment No"
        variant="outlined"
        value={shipmentNo}
        onChange={(e) => setShipmentNo(e.target.value)}
        className="mb-4 w-80"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="w-80"
      >
        Submit
      </Button>
    </div>
  );
}