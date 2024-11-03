const express = require('express');
const router = express.Router();
const Mcontroller = require('../controller/mcontroller');

router.get('/', Mcontroller.show.showlanding);
router.get('/register', Mcontroller.show.showRegister);
router.get('/login', Mcontroller.show.showLogin);
router.get('/dash', Mcontroller.show.showDashboard);
router.get('/materials', Mcontroller.show.showMaterials);
router.get('/contactUs', Mcontroller.show.showContactus);
router.get('/admin', Mcontroller.show.showAdminDash);
router.get('/forgot-password', Mcontroller.show.showForgotPassword);
router.get('/reset-password', Mcontroller.show.showResetPassword);

router.post('/emailVerification',Mcontroller.user.sendVerificationCode);
router.post('/verifyCode',Mcontroller.user.verifyCode);
router.post('/register', Mcontroller.user.register);
router.post('/login', Mcontroller.user.login);
router.post('/reset-password', Mcontroller.user.resetPassword);

module.exports = router;