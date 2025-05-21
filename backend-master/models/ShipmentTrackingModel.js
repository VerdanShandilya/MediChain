const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShipmentTrackingSchema = new Schema({
    
    updated_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['In Transit', 'Delivered', 'Pending', 'Cancelled']
    },
    sender_location: {
        type: String,
        required: true
    },
    receiver_location: {
        type: String,
        required: true
    },
    shipment: {
        type: Schema.Types.ObjectId,
        ref: 'Shipment',
        required: true
    },

    transits : [{
        location: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]

});

module.exports = mongoose.model('ShipmentTracking', ShipmentTrackingSchema);