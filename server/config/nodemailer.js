const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'sundaresansundarraj@gmail.com',
    pass: 'ovun sdfr lhhi kvdy'
  },
});

module.exports = transporter;
