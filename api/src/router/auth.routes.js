const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const stripeController = require('../controller/stripe.controller');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Stripe routes
router.post('/create-payment-intent', stripeController.createPaymentIntent);

module.exports = router;
