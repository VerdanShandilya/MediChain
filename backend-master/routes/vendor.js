const express = require('express');
const router = express.Router();
const VendorController = require("../controllers/VendorController");
// const requireAuth = require("../middleware/requireAuth");

// router.use(requireAuth);

// Create a new Vendor
router.post("/vendor/create", VendorController.addVendor);
router.get("/vendor/getAll", VendorController.getAllVendors);

module.exports = router;