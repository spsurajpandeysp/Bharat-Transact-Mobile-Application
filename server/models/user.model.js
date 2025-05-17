const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    qrCode: { type: String, default: () => `QR-${uuidv4()}` },
    mpin: { type: String,default:null,default:"" },
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number,default:10000 },
    isPhoneVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    ifsc : {type:String,default:"BTLN0000646"},
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  });
  
const User = mongoose.model("User", userSchema);
module.exports={User}