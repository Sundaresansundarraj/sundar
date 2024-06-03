const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phonenumber: { type: String },
    otp:{type: Number, default: 0},
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    status: { type: String, enum: ['default', 'approved1', 'approved2', 'approved3'], default: 'default' },
    primeExpires: { type: Date },
    personalData: {
        firstName: { type: String },
        lastName: { type: String },
        address: { type: String },
        phone: { type: String }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

