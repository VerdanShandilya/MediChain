const ShipmentTracking = require('../models/ShipmentTrackingModel');
const Shipment = require('../models/ShipmentModel');

// Create and Save a new ShipmentTracking

const addShipmentTracking = async (req, res) => {
    try {
        // Create a ShipmentTracking
        const shipmentTracking = new ShipmentTracking({
            updated_date: req.body.updated_date,
            status: req.body.status,
            sender_location: req.body.sender_location,
            receiver_location: req.body.receiver_location,
            shipment: req.body.shipment,
            transits: req.body.transits

        });

        // Save ShipmentTracking in the database
        const data = await shipmentTracking.save();
        res.send(data);



    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the ShipmentTracking."
        });
    }
}
  


// Find a single shipment with an id

const getShipmentTrackingById = async (req, res) => {
    try {
        const shipmentNumber = req.params.id;
        // console.log(shipmentNumber);
        

        // Fetch Shipment by Shipment Number
        const shipment = await Shipment.findOne({ shipment_number: shipmentNumber });
        if (!shipment) {
            return res.status(404).send({ message: "Shipment not found" });
        }

        // Fetch Shipment Tracking by Shipment ID
        const shipmentTracking = await ShipmentTracking.findOne({ shipment: shipment._id });
        if (!shipmentTracking) {
            return res.status(404).send({ message: "Shipment tracking not found" });
        }

        res.send(shipmentTracking);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the shipment tracking."
        });
    }
};


// add a new address to the shipment tracking
const updateLocation = async (req, res) => {
    try {
        // console.log("id : " , req.params.id);

        const shipment = await Shipment.findOne({ shipment_number: req.params.id });
        if (!shipment) {
            return res.status(404).send({ message: "Shipment not found" });
        }
        
        const shipmentTracking = await ShipmentTracking.findOne({ shipment: shipment._id });

        if (!shipmentTracking) {
            return res.status(404).send({ message: "Shipment tracking not found" });
        }
        

        let obj={
            location:req.body.location,
            updated_date:req.body.updated_date
        }

        shipmentTracking.transits.push(obj);
        shipmentTracking.status = req.body.status;

        await shipmentTracking.save();
        res.send(shipmentTracking);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while adding the address."
        });
    }
}


const fetchAllShipments = async (req, res) => {
    try {
        const shipments = await ShipmentTracking.find();
        res.send(shipments);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the shipments."
        });
    }
};

module.exports = {
    addShipmentTracking,
    getShipmentTrackingById,
    updateLocation,
    fetchAllShipments
}