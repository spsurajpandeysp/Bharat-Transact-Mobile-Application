const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // bharactTransactionId: { type: String, required: true, unique: true },
    balance: { type: Number,default:10000 },
    isEmailVerified: { type: Boolean, default: false },
    emailOtp: { type: String },
    otpExpiry: { type: Date },
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  });
  
const User = mongoose.model("User", userSchema);
module.exports={User}