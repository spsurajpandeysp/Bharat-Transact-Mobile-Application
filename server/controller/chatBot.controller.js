const { GoogleGenerativeAI } = require("@google/generative-ai");
const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});


const generateResponse = async (req,res) => {
  try {
    const prompt = req.body.message;
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
