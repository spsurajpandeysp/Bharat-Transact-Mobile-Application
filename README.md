# Bharat Transact – Mobile Payment App

**Bharat Transact** is a fast, secure, and user-friendly digital payment mobile application built for India. It allows users to send and receive payments, check balances, view transaction history, and pay using QR codes. It features secure authentication, OTP-based login, and a smart chatbot for user support.

---

## 🛠 Tech Stack

- **Frontend:** React Native  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Token)  
- **Phone Verification:** OTP using phone number  
- **Chatbot:** Gemmini AI-based support bot  

---

## 🚀 Features

- **Authentication**
  - Login and Signup
  - Forgot Password recovery
  - OTP verification via phone number

- **Payments**
  - Send Money to users
  - Receive Payments instantly
  - Pay using QR Code

- **Wallet**
  - Check Account Balance
  - View Transaction History

- **Support**
  - Integrated **Gemmini Chatbot** for FAQs and guided support

---

## 📦 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bharat-transact.git
cd bharat-transact
```

---

## 📱 Setup Mobile Application

### Install dependencies and run
```bash
cd mobile
npm install
npx react-native run-android  # or run-ios for iOS
```

> Make sure your emulator/device is ready.

---

## 🖥️ Setup Backend Server

### Install dependencies and run server
```bash
cd server
npm install
node index.js
```

> Make sure MongoDB is running locally or provide your remote URI in the `.env` file.

---

## 🔐 Environment Variables

Create a `.env` file inside the `server/` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bharat-transact
JWT_SECRET=your_jwt_secret_key
OTP_SERVICE_API_KEY=your_otp_provider_api_key
```

> Replace placeholder values with your actual credentials.

---

## 🧠 Future Enhancements

- UPI Integration  
- Bank Account Linking  
- Aadhaar-based KYC  
- In-App Notifications  
- Dark Mode UI  

---

## 🤝 Contribution

Contributions are welcome!  
Feel free to open issues, fork the repo, and submit pull requests.

---

## 👨‍💻 Developed By

**Suraj Pandey**
Full Stack Developer | MERN | React Native  
- GitHub: [@spsurajpandeysp](https://github.com/spsurajpandeysp)  
- LinkedIn: [linkedin.com/in/spsurajpandeysp](https://linkedin.com/in/spsurajpandeysp)

---


