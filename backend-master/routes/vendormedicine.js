// views

const express = require('express');
const router = express.Router();
const VendorMedicineController = require("../controllers/VendorMedicineController");
const requireAuth = require("../middleware/requireAuth");


// router.use(requireAuth);

// Create a new Medicine
router.post("/medicine/create",requireAuth, VendorMedicineController.addMedicine);
router.get("/medicine/getAll", requireAuth,VendorMedicineController.getAllMedicines);

module.exports = router;

