const express = require('express');
const router = express.Router();
const { generateResponse} = require('../controller/chatBot.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Route to generate chat response
router.post('/chat', authMiddleware.verifyToken, generateResponse);

// Route to clear chat history
// router.post('/clear-history', authMiddleware.verifyToken, clearHistory);

module.exports = router; 