const express = require('express')
const Router = express.Router();

const userController = require('../controller/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

Router.get('/balance',authMiddleware.verifyToken,userController.getBalance)


module.exports = Router