const HospitalMedicineModel = require('../models/HospitalMedicineModel');
const ShipmentModel = require('../models/ShipmentModel');
const PurchaseMedicine = require('../models/PurchaseMedicineModel');
const VendorMedicineModel = require('../models/VendorMedicineModel');
const ShipmentTracking = require('../models/ShipmentTrackingModel');
const { parseISO, differenceInMonths, isBefore } = require('date-fns');


// Create and Save a new HospitalMedicine



const acceptMedicineFromVendor = async (req, res) => {
    const { shipmentNo } = req.body;
    const { _id } = req.user;
    try {
        const shipment = await ShipmentModel.findOne({ shipment_number: shipmentNo, received_hospital: _id });
        if (!shipment) {
            return res.status(400).json({ error: "Shipment not found" });
        }
        // console.log(shipment);

        const medicines = shipment.medicines;
        for (let i = 0; i < medicines.length; i++) {
            const medicine = medicines[i];


            const data = await VendorMedicineModel.findOne({ _id: medicine.medicine });
            const hospitalMedicine = await HospitalMedicineModel.findOne({ name: data.name, hospital: _id });
            // console.log("hospitalmedicine",hospitalMedicine);
            if (hospitalMedicine) {
                hospitalMedicine.quantity += medicine.quantity;
                await hospitalMedicine.save();
            } else {
                // console.log("medicine",medicine);
                // find medicine in VendorMedicineModel by medicine id


                // console.log("medicine",data.description);

                await HospitalMedicineModel.create({
                    description: data.description,
                    hospital: _id,
                    quantity: medicine.quantity,
                    manufacturer: data.manufacturer,
                    name: data.name,
                    price: data.price,
                    expiryDate: data.expiryDate
                });
            }
        }
        await ShipmentTracking.updateOne({ shipment: shipment._id }, { status: "Delivered" });
        res.status(200).json({ message: "Medicines accepted" });

    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Something went wrong" });
    }




}

// Retrieve and return all medicines from the database.

const getHospitalMedicines = async (req, res) => {
    const { _id } = req.user;
    try {
        const data = await HospitalMedicineModel.find({ hospital: _id })
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving medicines."
        });
    }

}



const getDailyRevenue = async (req,res) => {
    try {
        const purchases = await PurchaseMedicine.aggregate([
            {
                $group: {
                    _id: {
                        hospital: "$hospital",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } }
                    },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $lookup: {
                    from: "hospitals",
                    localField: "_id.hospital",
                    foreignField: "_id",
                    as: "hospital"
                }
            },
            {
                $unwind: "$hospital"
            },
            {
                $project: {
                    _id: 0,
                    hospitalName: "$hospital.name",
                    date: "$_id.date",
                    totalRevenue: 1
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        res.status(200).send(purchases);


    } catch (err) {
        console.error("Error occurred while calculating daily revenue:", err);
        throw err;
    }
};




//  Create and Save a new PurchaseMedicine

const addPurchaseMedicine = async (req, res) => {
    try {
        // Create a PurchaseMedicine
        const purchaseMedicine = new PurchaseMedicine({
            patient_name: req.body.patient_name,
            patient_phone: req.body.patient_phone,
            patient_age: req.body.patient_age,
            medicines: req.body.medicines, // Updated to handle array of medicines
            purchaseDate: req.body.purchaseDate,
            totalPrice: req.body.totalPrice,
            hospital: req.user._id,
            state: req.body.state
        });

        // Save PurchaseMedicine in the database
        const data = await purchaseMedicine.save();

        // Update medicine stock   
        for (const medicine of req.body.medicines) {
            const medicineId = medicine.medicine;
            const quantity = medicine.quantity;

            // console.log(`Updating stock for medicineId: ${medicineId} with quantity: ${quantity}`);

            // Update the stock using HospitalMedicineModel
            const updatedMedicine = await HospitalMedicineModel.findOneAndUpdate(
                { _id: medicineId, hospital: req.user._id },
                { $inc: { quantity: -quantity } },
                { new: true }
            );

            if (!updatedMedicine) {
                // console.error(`Medicine with id ${medicineId} not found in hospital`);
                return res.status(404).send({ message: `Medicine with id ${medicineId} not found in hospital` });
            }

            // console.log(`Updated stock for medicineId: ${medicineId}, new quantity: ${updatedMedicine.quantity}`);
        }






        res.status(201).send(data);

    } catch (err) {
        // console.error("Error occurred while creating the PurchaseMedicine:", err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the PurchaseMedicine."
        });
    }
};

// Retrieve and return all purchase medicines from the database.

const getPurchaseMedicines = async (req, res) => {
    const { _id } = req.user;
    try {
        const data = await PurchaseMedicine.find({ hospital: _id }).populate('medicines.medicine');
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving purchase medicines."
        });
    }

}

// Retrieve and return all most selling medicines from the database.
const getMostSellingMedicines = async (req, res) => {
    const { _id } = req.user;
    try {
        const data = await PurchaseMedicine.find()
            .populate('medicines.medicine')
            .populate('hospital');
        let temp = [];
        console.log(data);

        // add all medicine to temp array
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].medicines.length; j++) {
                temp.push({
                    medicine: data[i].medicines[j],
                    hospital: data[i].hospital,
                    purchaseDate: data[i].purchaseDate,
                    state: data[i].state
                });
            }
        }
        // sort temp array
        temp.sort((a, b) => {
            return b.medicine.quantity - a.medicine.quantity;
        });

        // send response with sorted medicines and hospital details
        res.status(200).json({
            success: true,
            data: temp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
// Retrieve and return all least selling medicines from the database.
const getLeastSellingMedicines = async (req, res) => {
    const { _id } = req.user;
    try {
        const data = await PurchaseMedicine.find()
            .populate('medicines.medicine')
            .populate('hospital');
        let temp = [];
        console.log(data);

        // add all medicine to temp array
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].medicines.length; j++) {
                temp.push({
                    medicine: data[i].medicines[j],
                    hospital: data[i].hospital,
                    state: data[i].state
                });
            }
        }
        // sort temp array in ascending order
        temp.sort((a, b) => {
            return a.medicine.quantity - b.medicine.quantity;
        });

        // send response with sorted medicines and hospital details
        res.status(200).json({
            success: true,
            data: temp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// retrieve and return all medicines whose sell is less than 10

const getDeadStockMedicines = async (req, res) => {
    // Check if req.user is defined
    if (!req.user || !req.user._id) {
        return res.status(400).json({
            success: false,
            message: "User not authenticated or user ID not found."
        });
    }

    const { _id } = req.user;
    try {
        const data = await PurchaseMedicine.find()
            .populate('medicines.medicine')
            .populate('hospital');

        let medicineMap = new Map();

        // Aggregate quantities of each medicine
        data.forEach(purchase => {
            purchase.medicines.forEach(med => {
                let medicineId = med.medicine._id.toString();
                let quantity = med.quantity;

                if (medicineMap.has(medicineId)) {
                    medicineMap.get(medicineId).quantity += quantity;
                } else {
                    medicineMap.set(medicineId, {
                        medicine: med.medicine,
                        hospital: purchase.hospital,
                        quantity: quantity
                    });
                }
            });
        });

        // Filter out medicines with total quantity below the threshold
        let deadStock = [];
        medicineMap.forEach(value => {
            if (value.quantity < 10) {
                deadStock.push(value);
            }
        });



        // Send response with dead stock medicines and hospital details
        res.status(200).json({
            success: true,
            data: deadStock
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

const getCategorizedMedicines = async (req, res) => {
    try {
        const medicines = await HospitalMedicineModel.find().populate('hospital');

        const categorizedData = {
            nearbyExpiryMedicines: [],
            expiredMedicines: [],
            normalMedicines: []
        };

        medicines.forEach(medicine => {
            const expiryDate = new Date(medicine.expiryDate);
            const currentDate = new Date();

            if (isBefore(expiryDate, currentDate)) {
                categorizedData.expiredMedicines.push(medicine);
            } else if (differenceInMonths(expiryDate, currentDate) < 6) {
                categorizedData.nearbyExpiryMedicines.push(medicine);
            } else {
                categorizedData.normalMedicines.push(medicine);
            }
        });

        res.status(200).json(categorizedData);
    } catch (error) {
        console.error("Error fetching and categorizing medicines", error);
        res.status(500).json({ error: "Internal server error" });
    }
};





module.exports = {
    acceptMedicineFromVendor,
    getHospitalMedicines,
    addPurchaseMedicine,
    getPurchaseMedicines,
    getMostSellingMedicines,
    getLeastSellingMedicines,
    getDeadStockMedicines,
    getCategorizedMedicines,
    getDailyRevenue
}