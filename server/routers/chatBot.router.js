const express = require('express');
const router = express.Router();
const { generateResponse} = require('../controller/chatBot.controller');

// Route to generate chat response
router.post('/chat', generateResponse);

// Route to clear chat history
// router.post('/clear-history', authMiddleware.verifyToken, clearHistory);

module.exports = router; 