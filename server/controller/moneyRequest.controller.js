//Send MoneyRequest

const { MoneyRequest } = require('../models/moneyRequest.model');
const { User } = require('../models/user.model')
const mongoose = require('mongoose')
const { Transaction } = require('../models/transaction.model')

const sendMoneyRequest = async (req, res) => {
  const { fromEmail, toEmail, amount } = req.body;
  const {userId} = require.user
  // console.log(req.body)
  try {
    // console.log(fromEmail, toEmail)
    const fromUser = await User.findById(userId);
    const toUser = await User.findOne({ email: toEmail });


    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(fromUser.email)
    const moneyRequest = new MoneyRequest({
      fromUser: fromUser._id,
      toUser: toUser._id,
      amount,
    });

    await moneyRequest.save();
    res.status(201).send({ message: 'Money request created successfully' });
  } catch (err) {
    res.status(500).json({ message: "Error creating money request", error: err.message });
  }
}

const acceptMoneyRequest = async (req, res) => {
  const { requestId } = req.query;
  console.log(requestId)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const moneyRequest = await MoneyRequest.findById(requestId).populate('fromUser email').populate('toUser email');

    if (!moneyRequest) {
      return res.status(404).json({ message: 'Money request not found' });
    }

    if (moneyRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Money request has already been processed' });
    }

    if (moneyRequest.toUser.balance < moneyRequest.amount) {
      return res.status(400).json({ message: 'Insufficient balance to accept the request' });
    }
    moneyRequest.toUser.balance -= moneyRequest.amount;
    moneyRequest.fromUser.balance += moneyRequest.amount;
    moneyRequest.status = 'accepted';
    await moneyRequest.toUser.save();
    await moneyRequest.fromUser.save();
    await moneyRequest.save();

    const transactionNumber = await generateTransactionNumber();
    const transaction = new Transaction({
      transactionNumber,
      fromEmail: fromEmail,
      toEmail: toEmail,
      amount,
      status: 'Success'
    });
    await transaction.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Money request accepted successfully",
      transactionNumber, 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ message: "Error accepting money request", error: err.message });
  }
}

const rejectMoneyRequest = async (req, res) => {
  console.log("sdfsd")
  const { requestId } = req.query;
  console.log(requestId)

  try {
    const moneyRequest = await MoneyRequest.findById(requestId);

    if (!moneyRequest) {
      return res.status(404).json({message:'Money request not found'});
    }

    if (moneyRequest.status !== 'pending') {
      return res.status(400).json({message:'Money request has already been processed'});
    }

    moneyRequest.status = 'rejected';

    await moneyRequest.save();

    res.status(200).json({message:'Money request rejected successfully'});
  } catch (err) {
    res.status(500).json({message:'Error rejecting money request',error:err.error});
  }
}

const getMoneyRequest = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("ehll")
    const user =await User.findOne({email})

    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }


    console.log("dsfsdfds",user)

    const moneyRequests = await MoneyRequest.find({
      $or: [
        { fromUser: user._id },
        { toUser: user._id }
      ]
    }).populate('fromUser', 'firstName lastName email') 
      .populate('toUser', 'firstName lastName email');
    console.log(moneyRequests)

    if (!moneyRequests || moneyRequests.length === 0) {
      return res.status(404).json({ message: "No Money Request found." });
    }

    res.status(200).json({ moneyRequests });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Error retrieving Money Request history.",
      error: error.message
    });
  }
}

  const getAllMoneyRequest = async (req, res) => {
    try {
      const moneyRequest = await MoneyRequest.find();

      if (moneyRequest.length === 0) {
        return res.status(404).json({ message: "No Money Request found." });
      }

      res.status(200).json({ moneyRequest });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving Money Request history.", error: error.message });
    }
  }


  module.exports = { getMoneyRequest, getAllMoneyRequest, sendMoneyRequest, rejectMoneyRequest, acceptMoneyRequest }