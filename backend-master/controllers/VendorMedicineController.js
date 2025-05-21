// hi

const VendorMedicineModel = require("../models/VendorMedicineModel");

// Create and Save a new Medicine

const addMedicine = async (req, res) => {
    try{
        // Create a Medicine
        const medicine = new VendorMedicineModel({
            name: req.body.name,
            quantity: req.body.quantity,
            price: req.body.price,
            expiryDate: req.body.expiryDate,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            // add vendor id
            vendor: req.user._id
        });
    
        // Save Medicine in the database
        const data = await medicine.save();
        res.send(data);

    }
    catch(err){
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Medicine."
        });
    }
    
};


// Retrieve and return all medicines from the database.

const getAllMedicines = async (req, res) => {
    try{
        console.log(req.user._id);
        
        const data = await VendorMedicineModel.find();
        res.send(data);
    }
    catch(err){
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving medicines."
        });
    }
    
}


module.exports = {
    addMedicine,
    getAllMedicines
}