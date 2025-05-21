const express = require('express');
const router = express.Router();
const HospitalController = require("../controllers/HospitalController");
// const requireAuth = require("../middleware/requireAuth");

// router.use(requireAuth);

// Create a new Hospital
router.post("/hospital/create", HospitalController.addHospital);
router.get("/hospital/getAll", HospitalController.getAllHospitals);

module.exports = router;