import React, { useEffect, useState, useRef } from 'react';
import ShipmentDetail from '../../components/ShipmentDetail';

const TrackShipment = () => {
    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [filteredShipment, setFilteredShipment] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const modalRef = useRef(null);

    const fetchShipments = async () => {
        try {
            const token=JSON.parse(localStorage.getItem('user')).token;
            const response = await fetch('https://medichain-0usn.onrender.com/api/shipment/getAll',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data); // Check the fetched data

            // Fetch status for each shipment
            const shipmentsWithStatus = await Promise.all(data.map(async (shipment) => {
                try {
                    const statusResponse = await fetch(`https://medichain-0usn.onrender.com/api/shipmentTracking/getbyID/${shipment.shipment_number}`,{
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const statusData = await statusResponse.json();
                    return { ...shipment, status: statusData.status || 'Pending' };
                } catch (error) {
                    console.error(`Error fetching status for shipment ${shipment.shipment_number}: `, error);
                    return { ...shipment, status: 'Pending' };
                }
            }));

            setShipments(shipmentsWithStatus);
        } catch (error) {
            console.error('Error fetching shipments: ', error);
        }
    }

    useEffect(() => {
        fetchShipments();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal();
            }
        };

        if (selectedShipment) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedShipment]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500';
            case 'In Transit':
                return 'bg-blue-500';
            case 'Delivered':
                return 'bg-green-500';
            case 'Cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleShipmentClick = (shipment) => {
        console.log(`Shipment Number: ${shipment.shipment_number}`); // Log the shipment number
        setSelectedShipment(shipment);
    };

    const handleCloseModal = () => {
        setSelectedShipment(null);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {
        const shipment = shipments.find(shipment =>
            shipment.shipment_number.toLowerCase() === searchInput.toLowerCase()
        );
        setFilteredShipment(shipment);
        setSearchPerformed(true);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container mx-auto p-4 my-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Track Shipments</h1>
            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Search by Shipment Number"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                    className="w-1/2 p-2 border border-gray-300 rounded-lg text-center "
                />
                <button
                    onClick={handleSearch}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                >
                    Search
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchPerformed && !filteredShipment && (
                    <div className="flex justify-center items-center w-90">
                        <p>
                        </p>
                    </div>
                )}
                {searchPerformed && !filteredShipment && (
                    <div className="flex justify-center items-center w-90">
                        <p className="text-center inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-md">
                            No shipment found
                        </p>
                    </div>
                )}
                {filteredShipment && (
                    <div
                        key={filteredShipment._id}
                        className="bg-white shadow-md rounded-lg p-6 cursor-pointer"
                        onClick={() => handleShipmentClick(filteredShipment)}
                    >
                        <h2 className="text-xl font-bold mb-2">
                            Shipment Number: {filteredShipment.shipment_number}
                        </h2>
                        <p className="text-gray-700 mb-2">
                            Shipment Date:{" "}
                            {new Date(filteredShipment.shipment_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 mb-2">
                            Vendor: {filteredShipment.vendor.name}
                        </p>
                        <p className="text-gray-700 mb-2">
                            Received Hospital: {filteredShipment.received_hospital.name}
                        </p>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Status:</h3>
                            <div className={`inline-block px-3 py-1 text-white rounded-full ${getStatusClass(filteredShipment.status)}`}>
                                {filteredShipment.status}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {selectedShipment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
                    <div ref={modalRef} className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-6 my-8 max-h-full overflow-y-auto">
                        <ShipmentDetail shipment={selectedShipment} onClose={handleCloseModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackShipment;