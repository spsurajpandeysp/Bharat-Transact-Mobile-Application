const express = require('express')
const Router = express.Router();

const userController = require('../controller/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

Router.get('/balance',authMiddleware.verifyToken,userController.getBalance)
Router.post('/get-user-by-email',userController.getUserDetailsByEmail)
Router.get('/get-user-by-JWT',authMiddleware.verifyToken,userController.getUserByJWT)
Router.post('/get-user-by-qr-code',userController.getUserDetailsByQrCode)
Router.post('/get-user-by-phone-number',userController.getUserDetailsByPhoneNumber)
Router.post('/search-users-by-phone', userController.searchUsersByPhone)
module.exports = Router