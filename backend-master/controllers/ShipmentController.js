const ShipmentModel = require('../models/ShipmentModel');
const VendorModel = require('../models/VendorModel');
const HospitalModel = require('../models/HospitalModel');
const VendorMedicineModel = require('../models/VendorMedicineModel');

const ShipmentTracking = require('../models/ShipmentTrackingModel');

// Function to generate shipment number
const generateShipmentNumber = () => {
    const prefix = "SHIP";
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number

    return `${prefix}${dateString}${randomNumber}`;
};

// Create and Save a new Shipment
const addShipment = async (req, res) => {
    try {
        // Generate shipment number
        const shipmentNumber = generateShipmentNumber();

        // Create a Shipment
        const shipment = new ShipmentModel({
            shipment_number: shipmentNumber,
            medicines: req.body.medicines, // Updated to handle array of medicines
            shipment_date: req.body.shipment_date,
            vendor: req.user._id,
            received_hospital: req.body.received_hospital,
            total_cost: req.body.total_cost
        });

        // Save Shipment in the database
        const data = await shipment.save();

        // Fetch vendor and hospital details
        const vendor = await VendorModel.findById(req.user._id);
        const receivedHospital = await HospitalModel.findById(req.body.received_hospital);

        // Add initial shipment tracking
        const shipmentTracking = new ShipmentTracking({
            updated_date: new Date(),
            status: "In Transit",
            sender_location: vendor.location,
            receiver_location: receivedHospital.location,
            shipment: data._id,
            transits: [
                {
                    location: vendor.location,
                    date: new Date()
                }
            ]
        });

        // add logic to update the quantity of medicines in vendor
        const medicines = req.body.medicines;
        for (let i = 0; i < medicines.length; i++) {
            const medicine = medicines[i];


            const data = await VendorMedicineModel.findOne({ _id: medicine.medicine });

            const vendorMedicine = await VendorMedicineModel.findOne({ name: data.name, vendor: req.user._id });


            if (vendorMedicine) {
                vendorMedicine.quantity -= medicine.quantity;

                await vendorMedicine.save();
            }
        }

        await shipmentTracking.save();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Shipment."
        });
    }
};



// get all shipments
const getAllShipments = async (req, res) => {
    try {
        const data = await ShipmentModel.find(
            { vendor: req.user._id }
        ).populate("medicines.medicine").populate("vendor").populate("received_hospital");
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shipments."
        });
    }

};

// get shipment by id
const getShipmentById = async (req, res) => {
    try {
        const data = await ShipmentModel.findById(req.params.id).populate("medicines.medicine").populate("vendor").populate("received_hospital");
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving shipment."
        });
    }

}


module.exports = {
    addShipment,
    getAllShipments,
    getShipmentById
};