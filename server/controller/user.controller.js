const {Transaction} = require('../models/transaction.model');
const { User } = require('../models/user.model');




const helpUser = async(req, res) => {
    const { message } = req.body;
  
    if (!message) {
      return res.status(400).json({ reply: "Please send a message." });
    }
  
    let reply = "";
  

    if (message.toLowerCase().includes("balance")) {
   
      const bharactIdMatch = message.match(/BHT\d+/);
      if (bharactIdMatch) {
        const bharactTransactionId = bharactIdMatch[0];
        const User = await User.findOne({ bharactTransactionId });
  
        if (User) {
          reply = `Your balance is ₹${User.balance}.`;
        } else {
          reply = "User not found. Please check your Bharact ID.";
        }
      } else {
        reply = "Please provide your Bharact ID to check the balance.";
      }
    } else if (message.toLowerCase().includes("transaction history")) {
 
      const bharactIdMatch = message.match(/BHT\d+/);
      if (bharactIdMatch) {
        const bharactTransactionId = bharactIdMatch[0];
        const transactions = await Transaction.find({
          $or: [{ fromUserId: bharactTransactionId }, { toUserId: bharactTransactionId }]
        });
  
        if (transactions.length > 0) {
          reply = "Here are your recent transactions:\n";
          transactions.forEach(transaction => {
            reply += `Transaction Number: ${transaction.transactionNumber}, Amount: ₹${transaction.amount}, Status: ${transaction.status}\n`;
          });
        } else {
          reply = "No transactions found for this User.";
        }
      } else {
        reply = "Please provide your Bharact ID to check the transaction history.";
      }
    } else if (message.toLowerCase().includes("help")) {
      reply = "I can assist you with the following:\n- Check your balance (send 'balance BHTXXXX')\n- View your transaction history (send 'transaction history BHTXXXX')\n- For other queries, type 'help'.";
    } else {
      reply = "I'm sorry, I didn't understand that. Type 'help' for assistance.";
    }
  
    res.json({ reply });
  }

const updateUserDetails = async(req,res) =>{
  const { email, firstName, lastName, address } = req.body;
  let profilePic = req.file ? req.file.filename : null;  

  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;
    if (profilePic) user.profilePic = profilePic;  

    await user.save();

    res.status(200).json({ message: 'User details updated successfully!', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user details.', error: error.message });
  }
}

const getUserDetailsByUserId = async(req,res)=>{
  const userId = req.params
  console.log(userId)
}


const getUserDetailsByEmail = async(req,res) =>{

  const { email } =  req.body;


  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      qrCode:user.qrCode,
      balance:user.balance,
      address: user.address
    };

    res.status(200).json({ message: 'User details fetched successfully!', userDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details.', error: error.message });
  }
}

const getUserByJWT = async(req,res) =>{

  const { userId } =  req.user;


  try {


    if (!userId) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      qrCode:user.qrCode,
      balance:user.balance,
      email:user.email,
      profilePic: user.profilePic, 
      address: user.address
    };

    res.status(200).json({ message: 'User details fetched successfully!', userDetails });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details.', error: error.message });
  }
}

const getBalance = async (req, res) => {
  const {userId} = req.user
  console.log(userId)
  if (!userId) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
 
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    res.status(200).json({name:`${user.firstName} ${user.lastName}` ,balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching balance.", error: error.message });
  }
};


const getUserDetailsByQrCode = async(req,res)=>{
  const {qrCode} = req.body;
  console.log(qrCode)
  try{
    const user = await User.findOne({qrCode});
    console.log(user)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      qrCode: user.qrCode,
      phoneNumber: user.phoneNumber
    };

    res.status(200).json({ message: 'User details fetched successfully!', userDetails });
  }
  catch(error){
    res.status(500).json({message:"Error fetching user details.",error:error.message})
  }
}

const getUserDetailsByPhoneNumber = async(req,res)=>{
  const {phoneNumber} = req.body;
  console.log(phoneNumber)
  try{
    const user = await User.findOne({phoneNumber})
    if(!user) {
      return res.status(404).json({message:"User not found."})
    }

    const id = user._id;
    const transactions = await Transaction.find({toUser: id})
    console.log(transactions)

    if(!transactions || transactions.length === 0) {
      return res.status(404).json({message:"No transactions found for this user."})
    }

    const latestTransaction = transactions[0]; 

    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      transactionId: latestTransaction._id,
      phoneNumber: user.phoneNumber,
      date: latestTransaction.date,
      status: latestTransaction.status,
      amount:latestTransaction.amount
    }

    res.status(200).json({message:"User details fetched successfully!", userDetails})
  }
  catch(error){
    res.status(500).json({message:"Error fetching user details.", error:error.message})
  }
}
module.exports = {helpUser,updateUserDetails,getBalance,getUserDetailsByEmail,getUserByJWT,getUserDetailsByQrCode,getUserDetailsByPhoneNumber};