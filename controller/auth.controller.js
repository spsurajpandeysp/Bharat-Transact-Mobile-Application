const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const {User} = require('../models/user.model')
require('dotenv').config();


// Create transporter for sending mail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});


const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();  // Generates a 10-digit number
  };
  
  // Function to create a new user with a unique account number
const createUniqueAccount = async (name) => {
    let accountNumber;
    let accountExists = true;
    let formattedTransactionId;
  
    while (accountExists) {
      accountNumber = generateAccountNumber();
      formattedTransactionId = `${accountNumber}@bht`;

      // Check if the account number already exists in the database
      const existingUser = await User.findOne({ formattedTransactionId });
  
      // If account number doesn't exist, break the loop
      if (!existingUser) {
        accountExists = false;
      }
    }
  
    return formattedTransactionId;
    
};


// Get User Details using email extracted from JWT token
// app.get('/get-user-details', authenticateToken, async (req, res) => {
const getUserDetails = async(req,res) =>{
    const email = req.userEmail;  // Get email from the middleware
  
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Return user details
      const userDetails = {
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        address: user.address
      };
  
      res.status(200).json({ message: 'User details fetched successfully!', userDetails });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details.', error: error.message });
    }
  }

// user login controller
const userLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.isEmailVerified) {
            return res.status(401).json({ message: "Please verify your email before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, "suraj@321");
        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in.", error });
    }
}

const resendSendEmailVerifyOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate a new OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save the OTP in the database (upsert)
    await Otp.findOneAndUpdate(
      { email },
      { emailOtp, emailOtp },
      { otpExpiry: otpExpiry }
    );

    // Send the OTP via email


    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Resend: Verify Your Email",
      text: `Your OTP is ${otpCode}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully. Please check your email." });
  } catch (error) {
    console.error("Error in resendSendEmailVerifyOtp:", error);
    res.status(500).json({ message: "Error in resending OTP.", error });
  }
};

// User SignUp controller

const UserSignUp = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    // Connect to server


    try {
        // Check if email or BharactTransactionId already exists
        const existingUser = await User.findOne({email })
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // Generate OTP
        const otp = Math.floor(1000+ Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        // Send OTP via email
        await transporter.sendMail({
            from:process.env.EMAIL_APP_PASSWORD,
            to: email,
            subject: "Email Verification OTP",
            text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const formattedTransactionId = await createUniqueAccount();

        // Save user with OTP and set email as not verified
        console.log("fds")
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            bharactTransactionId: formattedTransactionId,
            emailOtp:otp,
            otpExpiry
        
        });
        await newUser.save();
        res.status(201).json({ message: "OTP sent to your email. Please verify your email." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error });
    }
}

// Email Verify Controller
const emailVerify = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified." });
        }

        if (user.emailOtp !== otp || new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.isEmailVerified = true;
        user.emailOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email.", error });
    }
}

// Forgot Password controller
const forgetPasword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate OTP for password reset
        const resetOtp = Math.floor(1000+Math.random()*9000);
        const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Send OTP via email
        await transporter.sendMail({
            to: email,
            subject: "Reset Password OTP",
            text: `Your OTP to reset your password is ${resetOtp}. It is valid for 10 minutes.`,
        });

        // Save OTP and expiry to user
        user.resetOtp = resetOtp;
        user.resetOtpExpiry = resetOtpExpiry;
        await user.save();

        res.status(200).json({ message: "Reset OTP sent to your email." });
    } catch (error) {
        res.status(500).json({ message: "Error sending reset OTP.", error });
    }
}

// Reset password controller
const resetPassword = async(req,res)=>{
    const { email, otp, newPassword, confirmNewPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.resetOtp !== otp || new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password.", error });
  }
}

const getAllUsers= async(req,res)=>{

  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No User Available" });
    }
    res.status(200).json({ message: 'Users details fetched successfully!', users });
  } catch (error) {
    res.status(500).json({ message: "Error Fetching user Details", error });
  }
}

module.exports={userLogin,getUserDetails,resetPassword,forgetPasword,emailVerify,forgetPasword,UserSignUp,getAllUsers,resendSendEmailVerifyOtp}