const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/reset-password',authMiddleware, userController.resetPassword);
router.post('/upgrade-prime', userController.upgradeToPrime);
router.put('/personal-data', authMiddleware, userController.updatePersonalData);
router.post('/sentotp',userController.generateAndSendOTP)
router.post("/otp",userController.verifypassword)
module.exports = router;
