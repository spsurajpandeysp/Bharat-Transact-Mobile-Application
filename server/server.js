const express = require("express");
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const authRounter = require('./routers/auth.router')
const moneyRequestRounter = require('./routers/moneyRequest.router')
const transactionRouter = require('./routers/transaction.router')
const userRouter = require('./routers/user.router')
const chatBotRouter = require('./routers/chatBot.router')
require('dotenv').config();


const PORT = process.env.PORT || 6000;
const DATABASE_URL = process.env.MONGODB_DATABASE_URL;




const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Successfully connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

connectDB();
  

app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json())

app.get('/',(req,res)=>{
  res.send('Welcome to bharat transact')
})
app.use('/api/auth/',authRounter);
app.use('/api/transaction/',transactionRouter);
app.use('/api/money-request/',moneyRequestRounter);
app.use('/api/user/',userRouter);
app.use('/api/chatbot/', chatBotRouter);



app.listen(PORT,()=>{
    console.log("Server is running on PORT: ",PORT)
})


module.exports = app;