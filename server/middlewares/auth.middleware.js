const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }
  jwt.verify(token, 'suraj@321', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    req.user = decoded; 
    next(); 
  });
};

module.exports = {verifyToken};