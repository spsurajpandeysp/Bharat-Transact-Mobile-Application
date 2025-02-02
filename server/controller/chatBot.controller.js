const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generateResponse = async (req, res) => {
  try {
    const prompt = req.body.message;
    console.log("prompt", prompt);

    const customPrompts = [
      { keywords: ["send money", "transfer money", "paise bhejo", "paise bhejne hai"], reply: "Please go back and use the Send Money section to complete your transaction." },
      { keywords: ["bank transfer", "bank se bhejo", "bank se paisa bhejna hai", "bank se transfer karna hai", "bank mein bhejna hai", "bank mein paisa dalna hai"], reply: "Please go back and use the Bank Transfer section to complete your transaction." },
      { keywords: ["scan and pay", "qr pay", "qr code se pay karna hai", "scan kar ke pay karna hai", "scan se payment karna hai"], reply: "Please go to the Scan and Pay section to complete your transaction." },
      { keywords: ["transaction history", "transaction dekhna hai", "transaction ka record", "transaction ka itihas", "transaction ka details", "transaction details dekhna hai"], reply: "Please go to the Transaction History section to view your transactions." },
      { keywords: ["transaction history", "transaction dekhna hai", "transaction ka record", "transaction ka itihas", "transaction ka details", "transaction details dekhna hai"], reply: "Please go to the Transaction History section to view your transactions." },
      { keywords: ["transaction history", "transaction dekhna hai", "transaction ka record", "transaction ka itihas", "transaction ka details", "transaction details dekhna hai"], reply: "Please go to the Transaction History section to view your transactions." },
    ];
    const lowerPrompt = prompt.toLowerCase();
    for (const custom of customPrompts) {
      if (custom.keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return res.status(200).json({
          message: custom.reply,
        });
      }
    }

    // Default Gemini AI logic
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    return res.status(200).json({
      message: response.text(),
    });
  } catch (error) {
    console.log("response error", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { generateResponse };
