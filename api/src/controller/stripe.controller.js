const stripeService = require('../services/stripe.service');

const createPaymentIntent = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const paymentIntent = await stripeService.createPaymentIntent(
      userId,
      amount
    );
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
};
