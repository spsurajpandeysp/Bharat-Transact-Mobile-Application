const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller')

router.post("/login",authController.userLogin)
router.post("/signup",authController.UserSignUp)
router.post("/forget-pass",authController.forgetPasword)
router.get("/users",authController.getAllUsers)
router.post("/phone-verify",authController.phoneVerify)
router.post("/forget-password",authController.forgetPasword)
router.post("/resend-phone-verify-otp",authController.resendSendPhoneVerifyOtp)
router.post("/reset-password",authController.resetPassword)
router.post("/create-mpin",authController.authMiddleware,authController.createMpin)

module.exports = router