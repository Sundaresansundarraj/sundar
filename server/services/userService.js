const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const smsService = require('../services/smsService');
const User = require('../models/user');
const mailService = require('../services/mailservice');
const SALT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 3;


const registerUser = async (username, password, email,phonenumber) => {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return { success: false, message: 'User already exists' };
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, password: hashedPassword, email,phonenumber });
    await user.save();
    const payload = { user: { id: username} };
    const token = jwt.sign(payload, "process.env.JWT_SECRET", { expiresIn: 360000 });
    return { success: true, message: 'User created successfully',token };
};

const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found' };
    }
   
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS && user.lockUntil > Date.now()) {
        return { success: false, message: 'Account locked. Please reset your password.' };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.lockUntil = Date.now() + 30 * 60 * 1000; 
            mailService.sendPasswordResetEmail(user.email, user.username);
            await user.save();
            return { success: false, message: 'Account locked. Please reset your password.' };
        }
        await user.save();
        
        return { success: false, message: 'Incorrect password' };
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    return { success: true, message: 'Login successful',token };
};

const generateAndSendOTP = async (username,phonenumber) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    const otp = smsService.generateOTP();
    console.log(user,"ssssssssssss");
    if(user.phonenumber !== phonenumber){
        return { success: false, message: 'enter correct phone number' };
    }
     await smsService.sendOTP(phonenumber, otp);
    user.otp = otp
    await user.save();
    return { success:true, message: 'otp sended successfully' };
};

const verifypassword = async (otp,username) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    console.log(otp)
    console.log(user.otp)
    if (user.otp !== otp) {
        return { success: false, message: 'enter correct otp' };
    }
    const payload = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
    return { success: true, message: 'correct otp',token };

}

const resetPassword = async (username, newPassword) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    mailService.passwordcorrected(user.email ,username,newPassword)
    return { success: true, message: 'Password reset successful' };
};

const upgradeToPrime = async (username, duration) => {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found' };
    }
    const now = new Date();
    switch (duration) {
        case 30:
            user.status = 'approved1';
            user.primeExpires = new Date(now.getTime() + 30 * 60 * 1000);
            break;
        case 60:
            user.status = 'approved2';
            user.primeExpires = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
            break;
        case 90:
            user.status = 'approved3';
            user.primeExpires = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
            break;
        default:
            return { success: false, message: 'Invalid duration' };
    }
    await user.save();
    mailService.sendPrimeStatusEmail(user.email, username, user.status);
    return { success: true, message: 'Account upgraded to prime' };
};

const updatePersonalData = async (userId, personalData) => {
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    user.personalData = personalData;
    await user.save();
    console.log(user)
    return { success: true, message: 'Personal data updated successfully' };
};



module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    upgradeToPrime,
    updatePersonalData,
    generateAndSendOTP,
    verifypassword
};

