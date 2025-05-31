const {User} = require('../models/user.model')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')


const handleAmount = (amount) => {
    return parseFloat(parseFloat(amount).toFixed(2));
};

const sendMoney = async (req, res) => {
  const { recipient, amount, mpin } = req.body;
  const { userId } = req.user;
  console.log("sendMoney", recipient, amount, mpin);

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

  let retries = 3; 
  let lastError;

  while (retries > 0) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
       
        const fromAccount = await User.findById(userId).session(session);
        const toAccount = await User.findOne({ phoneNumber: recipient }).session(session);

        if (!fromAccount) {
          throw new Error("Sender account not found.");
        }

        if (!toAccount) {
          throw new Error("Receiver Account not found.");
        }

        if (fromAccount.phoneNumber === toAccount.phoneNumber) {
          throw new Error("Sending money to your own account is not possible");
        }

        const transferAmount = handleAmount(amount);
        const currentBalance = handleAmount(fromAccount.balance);

        if (currentBalance < transferAmount) {
          throw new Error("Insufficient funds.");
        }

    
        const updatedFromAccount = await User.findOneAndUpdate(
          { _id: userId, balance: { $gte: transferAmount } },
          { $inc: { balance: -transferAmount } },
          { session, new: true }
        );

        if (!updatedFromAccount) {
          throw new Error("Failed to update sender's balance.");
        }

        const updatedToAccount = await User.findOneAndUpdate(
          { _id: toAccount._id },
          { $inc: { balance: transferAmount } },
          { session, new: true }
        );

        if (!updatedToAccount) {
          throw new Error("Failed to update receiver's balance.");
        }

      
        const transaction = new Transaction({
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount: transferAmount,
          status: "Success",
        });

        await transaction.save({ session });
      }, {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' }
      });

      await session.endSession();
      
     
      const transaction = await Transaction.findOne({
        fromUser: userId,
        toUser: (await User.findOne({ phoneNumber: recipient }))._id,
        amount: handleAmount(amount)
      }).sort({ date: -1 });

      res.status(200).json({
        message: "Transaction successful!",
        transactionId: transaction._id,
        data: await User.findOne({ phoneNumber: recipient })
      });
      
      return; 
    } catch (error) {
      await session.endSession();
      lastError = error;
      retries--;
      
      if (retries === 0) {
        console.log("Transaction error after all retries:", error.message);
        res.status(500).json({ 
          message: "Transaction failed after multiple attempts.", 
          error: error.message 
        });
        return;
      }
 
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
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
  console.log("bankTransfer", req.body);
  const { accountNumber, ifscCode, accountHolderName, amount, mpin } = req.body;
  const { userId } = req.user;
  console.log("bankTransfer", accountNumber, ifscCode, accountHolderName, amount, mpin);

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

  let retries = 3; 
  let lastError;

  while (retries > 0) {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const fromAccount = await User.findById(userId).session(session);
        const toAccount = await User.findOne({ accountNumber: accountNumber }).session(session);

        if (!fromAccount) {
          throw new Error("Sender account not found.");
        }

        if (!toAccount) {
          throw new Error("Receiver Account not found.");
        }

        if (fromAccount.accountNumber === accountNumber) {
          throw new Error("Sending money to your own account is not possible");
        }

        if (toAccount.ifsc !== ifscCode) {
          throw new Error("Invalid IFSC Code");
        }

        if (toAccount.firstName.toLowerCase() + " " + toAccount.lastName.toLowerCase() !== accountHolderName.toLowerCase()) {
          throw new Error("Invalid Account Holder Name");
        }

        const transferAmount = handleAmount(amount);
        const currentBalance = handleAmount(fromAccount.balance);

        if (currentBalance < transferAmount) {
          throw new Error("Insufficient funds.");
        }

        const updatedFromAccount = await User.findOneAndUpdate(
          { _id: userId, balance: { $gte: transferAmount } },
          { $inc: { balance: -transferAmount } },
          { session, new: true }
        );

        if (!updatedFromAccount) {
          throw new Error("Failed to update sender's balance.");
        }

        const updatedToAccount = await User.findOneAndUpdate(
          { _id: toAccount._id },
          { $inc: { balance: transferAmount } },
          { session, new: true }
        );

        if (!updatedToAccount) {
          throw new Error("Failed to update receiver's balance.");
        }


        const transaction = new Transaction({
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount: transferAmount,
          status: "Success",
        });

        await transaction.save({ session });
      }, {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' }
      });

      await session.endSession();
      

      const transaction = await Transaction.findOne({
        fromUser: userId,
        toUser: (await User.findOne({ accountNumber: accountNumber }))._id,
        amount: handleAmount(amount)
      }).sort({ date: -1 });

      res.status(200).json({
        message: "Transaction successful!",
        transactionId: transaction._id,
        data: await User.findOne({ accountNumber: accountNumber })
      });
      
      return;
    } catch (error) {
      await session.endSession();
      lastError = error;
      retries--;
      
      if (retries === 0) {
        console.log("Transaction error after all retries:", error.message);
        res.status(500).json({ 
          message: "Transaction failed after multiple attempts.", 
          error: error.message 
        });
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
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


const verifyQrCode = async (req, res) => {
  const { qrData } = req.body;
  if (!qrData) {
    return res.status(400).json({ valid: false, message: "QR data is required" });
  }

  const user = await User.findOne({ qrCode: qrData });
  if (user) {
    return res.status(200).json({ valid: true, userId: user._id });
  } else {
    return res.status(404).json({ valid: false, message: "QR code not found" });
  }
};
module.exports={sendMoney,getTransactionHistory,getAllTransactionHistory,bankTransfer,verifyAccountDetails,verifyQrCode}