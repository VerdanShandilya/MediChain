const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseMedicineSchema = new Schema({
    patient_name: {
        type: String,
        required: true
    },
    patient_phone: {
        type: String,
        required: true
    },
    patient_age: {
        type: Number,
        required: true
    },
    state:{
        type: String,
        required: true,
    },
    medicines: [{
        medicine: {
            type: Schema.Types.ObjectId,
            ref: 'HospitalMedicine',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
});

module.exports = mongoose.model('PurchaseMedicine', PurchaseMedicineSchema);