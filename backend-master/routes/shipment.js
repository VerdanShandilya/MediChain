const express = require('express');
const router = express.Router();
const ShipmentController = require("../controllers/ShipmentController");
const requireAuth = require('../middleware/requireAuth');

// router.use(requireAuth);

// Create a new Shipment
router.post("/shipment/create",requireAuth, ShipmentController.addShipment);

// Retrieve all shipments
router.get("/shipment/getAll",requireAuth, ShipmentController.getAllShipments);

// Retrieve shipment by ID
router.get("/shipment/getbyID/:id", requireAuth,ShipmentController.getShipmentById);


module.exports = router;