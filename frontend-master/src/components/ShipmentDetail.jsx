import React, { useEffect, useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Correct import statement

const ShipmentDetail = ({ shipment, onClose }) => {
    const [trackingData, setTrackingData] = useState(null);
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/shipmentTracking/getbyID/${shipment.shipment_number}`);
                const data = await response.json();
                setTrackingData(data);
            } catch (error) {
                console.error('Error fetching shipment tracking data: ', error);
            }
        };

        if (shipment) {
            fetchTrackingData();
        }
    }, [shipment]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!shipment || !trackingData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-6 my-8 max-h-full overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold mb-4">Shipment Details</h2>
                <div className="mb-4 p-4 border rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-2"><strong>Shipment Number:</strong> {shipment.shipment_number}</p>
                    <p className="text-gray-700 mb-2"><strong>Shipment Date:</strong> {new Date(shipment.shipment_date).toLocaleDateString()}</p>
                </div>

                <div className="mb-4 p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
                    <p className="text-gray-700 mb-2"><strong>Name:</strong> {shipment.vendor.name}</p>
                    <p className="text-gray-700 mb-2"><strong>Location:</strong> {shipment.vendor.location}</p>
                    <p className="text-gray-700 mb-2"><strong>Contact:</strong> {shipment.vendor.contact}</p>
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> {shipment.vendor.email}</p>
                </div>

                <div className="mb-4 p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Received Hospital Details</h3>
                    <p className="text-gray-700 mb-2"><strong>Name:</strong> {shipment.received_hospital.name}</p>
                    <p className="text-gray-700 mb-2"><strong>Location:</strong> {shipment.received_hospital.location}</p>
                    <p className="text-gray-700 mb-2"><strong>Contact:</strong> {shipment.received_hospital.contact}</p>
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> {shipment.received_hospital.email}</p>
                </div>

                <div className="mb-4 p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Medicines</h3>
                    <ul className="list-disc list-inside">
                        {shipment.medicines.map(med => (
                            <li key={med._id}>
                                {med.medicine.name} (Qty: {med.quantity})
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-4 p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Shipment Status</h3>
                    <div className="relative">
                        <div className="border-l-2 border-gray-300 absolute h-full left-4 top-0"></div>
                        <div className="mb-4 pl-8 relative">
                            <div className="w-8 h-8 rounded-full absolute left-0 top-0 flex items-center justify-center bg-blue-500 text-white">
                                <span>1</span>
                            </div>
                            <div className="ml-12">
                                <p className="font-semibold">Shipped from {trackingData.sender_location}</p>
                                <p className="text-gray-600 text-sm">{new Date(trackingData.updated_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {trackingData.transits && trackingData.transits.map((transit, index) => (
                            <div key={transit._id} className="mb-4 pl-8 relative">
                                <div className="w-8 h-8 rounded-full absolute left-0 top-0 flex items-center justify-center bg-green-500 text-white">
                                    <span>{index + 2}</span>
                                </div>
                                <div className="ml-12">
                                    <p className="font-semibold">In Transit at {transit.location}</p>
                                    <p className="text-gray-600 text-sm">{new Date(transit.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mb-4 pl-8 relative">
                            <div className="w-8 h-8 rounded-full absolute left-0 top-0 flex items-center justify-center bg-red-500 text-white">
                                <span>{trackingData.transits ? trackingData.transits.length + 2 : 2}</span>
                            </div>
                            <div className="ml-12">
                                <p className="font-semibold">Delivered to {trackingData.receiver_location}</p>
                                <p className="text-gray-600 text-sm">{new Date(trackingData.updated_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetail;