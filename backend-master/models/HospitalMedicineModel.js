
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HospitalMedicineSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    hospital:{
        type: Schema.Types.ObjectId,
        ref: 'Hospital'
    }
});

module.exports = mongoose.model('HospitalMedicine', HospitalMedicineSchema);