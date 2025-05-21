const VendorSchema = require('../models/VendorModel');

// Create and Save a new Vendor

const addVendor = async (req, res) => {
    try {
        // Create a Vendor
        const vendor = new VendorSchema({
            name: req.body.name,
            location: req.body.location,
            contact: req.body.contact,
            email: req.body.email
        });

        // Save Vendor in the database
        const data = await vendor.save();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Vendor."
        });
    }
};


// Retrieve and return all vendors from the database.

const getAllVendors = async (req, res) => {
    try {
        const data = await VendorSchema.find();
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving vendors."
        });
    }
}

module.exports = {
    addVendor,
    getAllVendors
}