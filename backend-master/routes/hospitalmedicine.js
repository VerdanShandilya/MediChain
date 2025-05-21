
const express = require('express');
const router = express.Router();
const HospitalMedicineController = require("../controllers/HospitalMedicineController");
const requireAuth = require("../middleware/requireAuth");




// accept medicine
router.post("/medicine/accept", requireAuth,HospitalMedicineController.acceptMedicineFromVendor);
// get hospital medicines
router.get("/medicine",requireAuth, HospitalMedicineController.getHospitalMedicines);

// create purchase medicine
router.post("/purchase",requireAuth, HospitalMedicineController.addPurchaseMedicine);

// get purchase medicine
router.get("/purchase",requireAuth, HospitalMedicineController.getPurchaseMedicines);

// get most selling medicine
router.get("/medicine/mostselling",requireAuth, HospitalMedicineController.getMostSellingMedicines);

// get least selling medicine
router.get("/medicine/leastselling",requireAuth, HospitalMedicineController.getLeastSellingMedicines);

// get low stock medicines
router.get("/medicine/deadstock",requireAuth, HospitalMedicineController.getDeadStockMedicines);

// get category wise medicines

router.get("/medicine/categorywise",requireAuth, HospitalMedicineController.getCategorizedMedicines);

// get revenue
router.get("/medicine/revenue",requireAuth, HospitalMedicineController.getDailyRevenue);

module.exports = router;