const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const {User} = require('../models/user.model')
require('dotenv').config();



const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();  // Generates a 10-digit number
  };
  

const createUniqueAccount = async (name) => {
    let accountNumber;
    let accountExists = true;
    let formattedTransactionId;
  
    while (accountExists) {
      accountNumber = Math.floor(10000000000 + Math.random() * 90000000000).toString(); // Generates an 11-digit number
      formattedTransactionId = `${accountNumber}`;

      const existingUser = await User.findOne({ formattedTransactionId });

      if (!existingUser) {
        accountExists = false;
      }
    }
  
    return formattedTransactionId;
};


const getUserDetails = async(req,res) =>{
    const email = req.userEmail;  
  
    try {
   
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
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


const userLogin = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {  
        return res.status(400).json({ message: "Phone number and password are required." });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!user.isPhoneVerified) {
            return res.status(401).json({ message: "Please verify your phone number before logging in." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, "suraj@321", { expiresIn: '24h' });
        res.status(200).json({ 
            message: "Login successful.", 
            token,
            userId: user._id 
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in.", error });  
    }
}

// Add auth middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, "suraj@321");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

  const resendSendPhoneVerifyOtp = async (req, res) =>    {

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {

    const user = await User.findOne({ phoneNumber });   
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    if (user.isPhoneVerified) {
      return res.status(400).json({ message: "Phone number is already verified." });
    }


    const otpCode = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 10 * 60 * 1000; 

    await User.findOneAndUpdate(
      { phoneNumber },
      { 
        otp:otpCode, 
        otpExpiry 
      },
      { 
        new: true, 
        upsert: true
      } 
    );
    

    res.status(200).json({ message: "OTP sent successfully. Please check your phone number." });  
  } catch (error) {

    res.status(500).json({ message: "Error in resending OTP.", error });
  }
};



const UserSignUp = async (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        password,
        confirmPassword,
    } = req.body;

    console.log(req.body)

    if (!firstName || !lastName || !phoneNumber || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }



    try {
    
        const existingUser = await User.findOne({phoneNumber })
        if (existingUser) {
            return res.status(409).json({ message: "Phone number already in use." });
        }


        const otp = Math.floor(1000+ Math.random() * 9000);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

     

        const hashedPassword = await bcrypt.hash(password, 10);
        const formattedTransactionId = await createUniqueAccount();

        console.log("formattedTransactionId",formattedTransactionId)

        console.log("fds")
        const newUser = new User({
            firstName,
            lastName,
            phoneNumber,
            password: hashedPassword,
            accountNumber: formattedTransactionId,
            otp:otp,
            otpExpiry
        
        });
        await newUser.save();
        res.status(201).json({ message: "OTP sent to your phone number. Please verify your phone number." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error });
    }
}


const phoneVerify = async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required." });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isPhoneVerified) {
            return res.status(400).json({ message: "Phone number is already verified." });
        }

        if (user.otp !== otp || new Date() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.isPhoneVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "Phone number verified successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error verifying phone number.", error });
    }
}


const forgetPasword = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is required." });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }


        const resetOtp = Math.floor(1000+Math.random()*9000);
        const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

 

  
        user.resetOtp = resetOtp;
        user.resetOtpExpiry = resetOtpExpiry;
        await user.save();

        res.status(200).json({ message: "Reset OTP sent to your phone number." });
    } catch (error) {
        res.status(500).json({ message: "Error sending reset OTP.", error });
    }
}


const resetPassword = async(req,res)=>{
    const { phoneNumber, otp, newPassword, confirmNewPassword } = req.body;
      console.log(req.body)

  if (!phoneNumber || !otp || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.resetOtp !== otp || new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

 
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
const createMpin = async(req,res)=>{
  console.log("kya aaya req",req.body);
  try{
    const {mpin} = req.body;
    if(!mpin){
      return res.status(400).json({message:"MPIN is required"})
    }
    if(mpin.length !== 4){
      return res.status(400).json({message:"MPIN must be 4 digits"})
    } 
    // const hashedMpin = await bcrypt.hash(mpin,10);
    const user = await User.findByIdAndUpdate(req.user.userId,{mpin:mpin},{new:true});
    res.status(200).json({message:"Mpin created successfully"})
  }
  catch(error){
    console.log("kya aaya error",error);
    res.status(500).json({message:"Error creating mpin",error})
  }
  
}
module.exports={userLogin,getUserDetails,resetPassword,forgetPasword,phoneVerify,UserSignUp,getAllUsers,resendSendPhoneVerifyOtp,createMpin,authMiddleware}