const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller')

router.post("/login",authController.userLogin)
router.post("/signup",authController.UserSignUp)
router.post("/forget-pass",authController.forgetPasword)
router.get("/users",authController.getAllUsers)
router.post("/email-verify",authController.emailVerify)
router.post("/forget-password",authController.forgetPasword)
router.post("/reset-password",authController.resetPassword)


module.exports = router