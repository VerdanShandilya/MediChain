const Feedback = require('../models/FeedbackModel');

// Create and Save a new Feedback

const addFeedback = async (req, res) => {
    try {
        // Create a Feedback
        const feedback = new Feedback({
            // user_id: req.body.user_id,
            medicine_name: req.body.medicine_name,
            hospital_name: req.body.hospital_name,
            symptoms: req.body.symptoms,
            side_effects: req.body.side_effects
        });

        // Save Feedback in the database
        const data = await feedback.save();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Feedback."
        });
    }
};


// Retrieve and return all feedbacks from the database.

const getAllFeedbacks = async (req, res) => {
    try {
        const data = await Feedback.find().populate('medicine_name').populate('hospital_name');
        res.send(data);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving feedbacks."
        });
    }
}

module.exports = {
    addFeedback,
    getAllFeedbacks
}
