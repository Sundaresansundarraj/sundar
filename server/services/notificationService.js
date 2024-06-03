const cron = require('node-cron');
const User = require('../models/user');
const mailService = require('./mailservice');

 const jj = cron.schedule('* * * * *', async () => {
    console.log('Running daily prime account expiry check...');
    const now = new Date();

    const users = await User.find({
        primeExpires: { $exists: true, $ne: null },
        status: { $in: ['approved1', 'approved2', 'approved3'] }
    });

    for (let user of users) {
        const timeUntilExpiry = user.primeExpires.getTime() - now.getTime();

        if (timeUntilExpiry <= 0) {
            user.status = 'default';
            user.primeExpires = null;
            await user.save();
            mailService.sendPrimeExpiredEmail(user.email, user.username);
        }
         else if (timeUntilExpiry <= 24 * 60 * 60 * 1000) {
            mailService.sendPrimeExpiryWarningEmail(user.email, user.username);
        }
    }
});
module.exports = {jj}

