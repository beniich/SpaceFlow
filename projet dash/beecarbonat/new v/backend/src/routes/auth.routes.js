const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.post('/firebase', ctrl.firebaseLogin);
router.get('/me', authMiddleware, ctrl.getProfile);

// Nouvelles routes
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/verify-email', ctrl.verifyEmail);
router.post('/resend-verification', ctrl.resendVerification);

module.exports = router;
