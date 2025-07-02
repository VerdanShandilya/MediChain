import  { useEffect, useState } from 'react';
import Loadar from '../../components/Loadar';  // Assuming Loadar is your loader component
import { useNavigate } from 'react-router-dom';
const ViewShipments = () => {
    const [shipments, setShipments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const navigate = useNavigate();

    const fetchShipments = async () => {
        try {
            if(!localStorage.getItem('user')){
                navigate('/login');
                return;
            }
            const token=JSON.parse(localStorage.getItem('user')).token;
            const response = await fetch('https://medichain-0usn.onrender.com/api/shipment/getAll',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setShipments(data);
        } catch (error) {
            console.error('Error fetching shipments: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, []);

    if (loading) {
        return <Loadar />;
    }

    const handleViewDetails = (shipment) => {
        setSelectedShipment(shipment);
    };

    const handleCloseDetails = () => {
        setSelectedShipment(null);
    };

    return (
        <div className="relative bg-gray-50 min-h-screen p-6">
            {/* Main Content */}
            <div className={`container mx-auto p-4 transition-all duration-300 ${selectedShipment ? 'blur-md' : ''}`}>
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Shipments Overview</h1>
                <div className="overflow-x-auto shadow-lg sm:rounded-lg bg-white p-6">
                    <table className="min-w-full bg-gray-100 rounded-lg shadow-lg">
                        <thead className="bg-indigo-500 text-white">
                            <tr>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Shipment No</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Shipment Date</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Vendor</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Received Hospital</th>
                                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {shipments && shipments.map(shipment => (
                                <tr key={shipment._id} className="hover:bg-indigo-100 transition">
                                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{shipment.shipment_number}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">{new Date(shipment.shipment_date).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        <div>{shipment.vendor.name}</div>
                                        <div>{shipment.vendor.location}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-600">
                                        <div>{shipment.received_hospital.name}</div>
                                        <div>{shipment.received_hospital.location}</div>
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <button
                                            className="text-indigo-600 font-bold hover:text-indigo-900 hover:underline transition"
                                            onClick={() => handleViewDetails(shipment)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shipment Details Modal */}
            {selectedShipment && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-20 backdrop-blur-sm z-50 transition-opacity duration-300">
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative animate-fade-in">
            
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipment Details</h2>
                        <p className="text-gray-700 mb-2"><strong>Shipment Number:</strong> {selectedShipment.shipment_number}</p>
                        <p className="text-gray-700 mb-4"><strong>Shipment Date:</strong> {new Date(selectedShipment.shipment_date).toLocaleDateString()}</p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Medicines</h3>
                        <ul className="list-disc list-inside text-gray-600 mb-6">
                            {selectedShipment.medicines.map(med => (
                                <li key={med._id}>
                                    {med.medicine.name} (Qty: {med.quantity})
                                </li>
                            ))}
                        </ul>

                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                            onClick={handleCloseDetails}
                        >
                            &#10005;
                        </button>

                        <button
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            onClick={handleCloseDetails}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewShipments;