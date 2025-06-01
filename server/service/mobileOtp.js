
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendOtpMessage = async (mobileNumber, messg, fromNumber = '+12313106393') => {
  try {
    const message = await client.messages.create({
      body: messg,
      to: `+91${mobileNumber}`,
      from: fromNumber
    });
    console.log(`Message sent with SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = sendOtpMessage;