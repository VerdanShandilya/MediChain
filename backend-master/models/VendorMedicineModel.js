// hii
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicineSchema = new Schema({
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
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    }
});

module.exports = mongoose.model('Medicine', MedicineSchema);