const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShipmentSchema = new Schema({
    shipment_number: {
        type: String,
        required: true,
        unique: true
    },
    shipment_date: {
        type: Date,
        required: true
    },
    total_cost: {
        type: Number,
        required: true,
        default: 0
    },
    medicines: [{
        medicine: {
            type: Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    received_hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
});

module.exports = mongoose.model('Shipment', ShipmentSchema);