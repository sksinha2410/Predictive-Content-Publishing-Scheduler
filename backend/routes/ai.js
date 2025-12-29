const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/predict-times', aiController.predictBestTimes);
router.post('/generate-headlines', aiController.generateHeadlines);
router.get('/analyze/:postId', aiController.analyzeSuggestions);

module.exports = router;
