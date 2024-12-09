const {User} = require('../models/user.model')
const {Transaction} = require('../models/transaction.model')
const mongoose = require('mongoose')
const generateTransactionNumber = async () => {
  const lastTransaction = await Transaction.findOne().sort({ transactionNumber: -1 }).limit(1);
  const lastNumber = lastTransaction ? parseInt(lastTransaction.transactionNumber) : 0;
  return (lastNumber + 1).toString().padStart(6, '0'); // Pad the number to a 6-digit string
};
//// Dummy Route to send money

const sendMoney = async (req, res) => {
  const { recipient, amount } = req.body;
  const { userId } = req.user;

  if (!userId || !recipient || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
      // Get both accounts by their IDs
      const fromAccount = await User.findById(userId).session(session);
      const toAccount = await User.findOne({ email: recipient }).session(session);

      if (!fromAccount || !toAccount) {
          throw new Error("One or both accounts not found.");
      }

      // Check if the sender has enough balance
      if (fromAccount.balance < amount) {
          throw new Error("Insufficient funds.");
      }

      // Perform the transaction (debit and credit)
      fromAccount.balance = Number(fromAccount.balance) - Number(amount);
      toAccount.balance = Number(toAccount.balance) + Number(amount);

      // Save changes to the accounts
      await fromAccount.save({ session });
      await toAccount.save({ session });

      // Generate a new transaction number
      const transactionNumber = await generateTransactionNumber();

      // Create a transaction history entry
      const transaction = new Transaction({
          transactionNumber,
          fromUser: fromAccount._id,
          toUser: toAccount._id,
          amount,
          status: "Success",
      });
      await transaction.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
          message: "Transaction successful!",
          transactionNumber, // Return the transaction number
      });
  } catch (error) {
      // Abort the transaction in case of error
      await session.abortTransaction();
      session.endSession();

      res.status(500).json({ message: "Transaction failed.", error: error.message });
  }
};



// Transaction History Route

const getTransactionHistory = async (req, res) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Fetch transactions involving the user as sender or receiver
    const transactions = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'firstName lastName email') // Populate selected fields
      .populate('toUser', 'firstName lastName email');

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    // Transform transactions for response
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
        createdAt: transaction.createdAt,
      };
    });

    res.status(200).json({ transactions: modifiedTransactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history.", error: error.message });
  }
};



const getAllTransactionHistory = async(req,res) => {
  try {
    // Find transactions related to the provided Bharact Transaction ID
    const transactions = await Transaction.find({});
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history", error: error.message });
  }
}






module.exports={sendMoney,getTransactionHistory,getAllTransactionHistory}