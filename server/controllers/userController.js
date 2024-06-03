const userService = require('../services/userService');
const mailService = require('../services/mailservice');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { username, password, email,phonenumber } = req.body;
    const result = await userService.registerUser(username, password, email,phonenumber);
    if (result.success) {
        mailService.usercreatedSuccess(email,username)
        
        return res.status(201). json({message: result.message,result : result.token})
    }
    return res.status(400).send(result.message);
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const result = await userService.loginUser(username, password);
  
    if (!result.success) {
      return res.status(400).send(result.message);
    }
  
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Token is required' });
    }
  
    jwt.verify(token, "process.env.JWT_SECRET", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return res.status(200).json({ message: result.message, result: result.token });
    });
  };

const generateAndSendOTP = async (req, res) => {
  const { username, phonenumber } = req.body;
  const result = await userService.generateAndSendOTP(username,phonenumber);
  if (result.success) { 
     return res.status(200).send(result.message,);    
    }
  return res.status(400).send(result.message);
};

const verifypassword  = async (req, res) => {
  const { otp,username } = req.body;
  const result = await userService.verifypassword(otp,username);
  if (result.success) { 
    return res.status(200).json({ message: result.message, result: result.token });    
    }
  return res.status(400).send(result.message);
};

const resetPassword = async (req, res) => {
    const { username, newPassword } = req.body;
    const result = await userService.resetPassword(username, newPassword);
    if (result.success) {
      
        return res.status(200).send(result.message);
        
    }
    return res.status(400).send(result.message);
};

const upgradeToPrime = async (req, res) => {
    const { username, duration } = req.body;
    const result = await userService.upgradeToPrime(username, duration);
    if (result.success) {
        return res.status(200).send(result.message);
    }
    return res.status(400).send(result.message);
};

const updatePersonalData = async (req, res) => {
  const { personalData } = req.body;
  const userId = req.user.id;
  const result = await userService.updatePersonalData(userId, personalData);
  if (result.success) {
      return res.status(200).send(result.message);
  }
  return res.status(400).send(result.message);
};

module.exports = {
    register,
    login,
    resetPassword,
    upgradeToPrime,
    updatePersonalData,
    generateAndSendOTP,
    verifypassword
};
