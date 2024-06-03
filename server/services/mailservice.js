const transporter = require('../config/nodemailer');

const usercreatedSuccess = (email, username) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'account created',
        text: `Welcome ${username},\n your account have been created\n\nBest regards,\nsundar`}
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('account created: ' + info.response);
    });
};

const sendPasswordResetEmail = (email, username) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Dear ${username},\n\nPlease use the following link to reset your password: http://localhost:3000/reset-password?username=${username}\n\nBest regards,\nsundar`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Password reset email sent: ' + info.response);
    });
};

const passwordcorrected = (email, username,newPassword) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'new password created',
        text: `Dear ${username},\n\nyour new password " ${newPassword} "\n\nBest regards,\nsundar`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('new password created: ' + info.response);
    });
};

const sendPrimeStatusEmail = (email, username, status) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Prime Account Status',
        text: `Dear ${username},\n\nYour account status has been updated to ${status}.\n\nBest regards,\nsundar`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Prime status email sent: ' + info.response);
    });
};
const sendPrimeExpiryWarningEmail = (email, username) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Prime Account Expiry Warning',
        text: `Dear ${username},\n\nYour prime account will expire within a day.\n\nBest regards,\nYour Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Prime expiry warning email sent: ' + info.response);
    });
};

const sendPrimeExpiredEmail = (email, username) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Prime Account Expired',
        text: `Dear ${username},\n\nYour prime account has expired.\n\nBest regards,\nYour Team`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Prime account expired: ' + info.response);
    });
};

module.exports = {
    sendPasswordResetEmail,
    sendPrimeStatusEmail,
    usercreatedSuccess,
    passwordcorrected,
    sendPrimeExpiryWarningEmail,
    sendPrimeExpiredEmail
};