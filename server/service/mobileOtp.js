const accountSid = 'AC76ceccf6bb1d56d3dcf0f730c1bc783d';
const authToken = '1f8c831a0671e940a9434457d6c78ef5';
const client = require('twilio')(accountSid, authToken);

const sendOtpMessage = async (mobileNumber, messg, fromNumber = '+17073532494') => {
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