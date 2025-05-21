const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const FeedbackSchema = new Schema({
    // user_id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    medicine_name: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    hospital_name: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    symptoms: {
        type: String,
        required: true
    },
    side_effects: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

