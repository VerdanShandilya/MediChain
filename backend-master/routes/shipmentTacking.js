const express = require('express');
const router = express.Router();
const ShipmentTrackingController = require("../controllers/ShipmentTrackingController");
const requireAuth = require('../middleware/requireAuth');


// Create a new Shipment Tracking
router.post("/shipmentTracking/create", requireAuth,ShipmentTrackingController.addShipmentTracking);

// Retrieve shipment tracking by ID

router.get("/shipmentTracking/getbyID/:id", requireAuth,ShipmentTrackingController.getShipmentTrackingById);


router.post("/shipmentTracking/updatelocation/:id", requireAuth, ShipmentTrackingController.updateLocation);


router.get("/shipmentTracking/getall", requireAuth,ShipmentTrackingController.fetchAllShipments);

module.exports = router;