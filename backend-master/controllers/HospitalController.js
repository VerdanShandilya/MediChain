const Hospital = require('../models/HospitalModel');

// Create and Save a new Hospital

const addHospital = async (req, res) => {
    try {
        // Create a Hospital
        const hospital = new Hospital({
            name: req.body.name,
            location: req.body.location,
            contact: req.body.contact,
            email: req.body.email
        });

        // Save Hospital in the database
        const data = await hospital.save();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Hospital."
        });
    }
};


// Retrieve and return all hospitals from the database.

const getAllHospitals = async (req, res) => {
    try {
        const data = await Hospital.find();
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving hospitals."
        });
    }
}

module.exports = {
    addHospital,
    getAllHospitals
}