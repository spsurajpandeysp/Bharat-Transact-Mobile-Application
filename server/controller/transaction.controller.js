const {User} = require('../models/user.model')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')


const sendMoney = async (req, res) => {
  const { recipient, amount,mpin } = req.body;
  const { userId } = req.user;
  console.log("sendMoney",recipient, amount,mpin)

  if (!userId || !recipient || !amount || amount <= 0 || !mpin) {
      return res.status(400).json({ message: "Invalid input. or Required All Fields" });
  }

  if(mpin){
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({ message: "User not found." });
    }
    if(user.mpin !== mpin){
      return res.status(400).json({ message: "Invalid MPIN." });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
     
      const fromAccount = await User.findById(userId).session(session);
      const toAccount = await User.findOne({ phoneNumber: recipient }).session(session);

      if (!toAccount) {
        
          throw new Error("Receiver Account not found.");
      }

      if (fromAccount.phoneNumber ==  toAccount.phoneNumber) {
        throw new Error("You not send money in your Account");
    }

   
      if (fromAccount.balance < amount) {
          throw new Error("Insufficient funds.");
      }

   
      fromAccount.balance = Number(fromAccount.balance) - Number(amount);
      toAccount.balance = Number(toAccount.balance) + Number(amount);


      await fromAccount.save({ session });
      await toAccount.save({ session });

  
      const transaction = new Transaction({
       
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount,
          status: "Success",
      });
      const response = await transaction.save({ session });
      console.log(response)

  
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
          message: "Transaction successful!",
          transactionId:response._id, 
          data:toAccount
      });
  } catch (error) {
    
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({ message: "Transaction failed.", error: error.message });
  }
};





const getTransactionHistory = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
 
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'firstName lastName email') 
      .populate('toUser', 'firstName lastName email');

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    const modifiedTransactions = transactions.map(transaction => {
      const isOutgoing = transaction.fromUser._id.toString() === userId;
      return {
        transactionId: transaction._id,
        amount: transaction.amount,
        prefix: isOutgoing ? '-' : '+',
        direction: isOutgoing ? 'outgoing' : 'incoming',
        fromUser: transaction.fromUser,
        toUser: transaction.toUser,
        status: transaction.status,
        createdAt: transaction.date,
      };
    });

    res.status(200).json({ transactions: modifiedTransactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history.", error: error.message });
  }
};



const getAllTransactionHistory = async(req,res) => {
  try {
  
    const transactions = await Transaction.find({});
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history", error: error.message });
  }
}


const bankTransfer = async (req, res) => {
  console.log("bankTransfer",req.body)
  const { accountNumber, ifscCode, accountHolderName, amount,mpin } = req.body;
  const { userId } = req.user;
  console.log("sendMoney",accountNumber, ifscCode, accountHolderName, amount,mpin)

  if (!userId || !accountNumber || !ifscCode || !accountHolderName || !amount || amount <= 0 || !mpin) {
      return res.status(400).json({ message: "Invalid input. or Required All Fields" });
  }

  if(mpin){
    const user = await User.findById(userId);
    if(!user){
      return res.status(400).json({ message: "User not found." });
    }
    if(user.mpin != mpin){ 
      return res.status(400).json({ message: "Invalid MPIN." });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
     
      const fromAccount = await User.findById(userId).session(session);
      const toAccount = await User.findOne({ accountNumber: accountNumber }).session(session);

      if (!toAccount) {
        
          throw new Error("Receiver Account not found.");
      }

      if(fromAccount.accountNumber == accountNumber){
        throw new Error("You not send money in your Account");
      }

      if(toAccount.ifsc != ifscCode){
        throw new Error("Invalid IFSC Code");
      }

        if(toAccount.firstName.toLowerCase()+" "+toAccount.lastName.toLowerCase() != accountHolderName.toLowerCase()){
        throw new Error("Invalid Account Holder Name");
      }

    

   
      if (fromAccount.balance < amount) {
          throw new Error("Insufficient funds.");
      }

   
      fromAccount.balance = Number(fromAccount.balance) - Number(amount);
      toAccount.balance = Number(toAccount.balance) + Number(amount);


      await fromAccount.save({ session });
      await toAccount.save({ session });

  
      const transaction = new Transaction({
       
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount,
          status: "Success",
      });
      const response = await transaction.save({ session });
      console.log(response)

  
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
          message: "Transaction successful!",
          transactionId:response._id, 
          data:toAccount
      });
  } catch (error) {
    
      await session.abortTransaction();
      session.endSession();
      console.log(error.message)
      res.status(500).json({ message: "Transaction failed.", error: error.message });
  }
};



const verifyAccountDetails = async (req, res) => {
  try {
    const { accountNumber, ifscCode, accountHolderName } = req.body;
    const { userId } = req.user;

    console.log(accountNumber, ifscCode, accountHolderName)

    if (!userId || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ message: "Invalid input. or Required All Fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

     const receiverAccount = await User.findOne({ accountNumber: accountNumber });

    if (!receiverAccount) {
      return res.status(400).json({ message: "Receiver Account not found." });
    }

  

    if (ifscCode != receiverAccount.ifsc) {
      return res.status(400).json({ message: "Invalid IFSC Code." });
    }

    if (accountHolderName.toLowerCase() != receiverAccount.firstName.toLowerCase()+" "+receiverAccount.lastName.toLowerCase()) {
      return res.status(400).json({ message: "Invalid Account Holder Name." });
    }

    if(user.accountNumber == accountNumber){
      return res.status(400).json({ message: "You can't send money in your own account." });
    }

    return res.status(200).json({ message: "Account Details Verified."});
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: "An error occurred while verifying account details.", error: error.message });
  }
}



module.exports={sendMoney,getTransactionHistory,getAllTransactionHistory,bankTransfer,verifyAccountDetails}