const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');

// Create a new Feedback
router.post('/feedback/create', feedbackController.addFeedback);

// Retrieve all Feedbacks
router.get('/feedback/getAll', feedbackController.getAllFeedbacks);

module.exports = router;