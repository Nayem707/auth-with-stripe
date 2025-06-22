const { PrismaClient } = require('@prisma/client');
const stripe = require('../config/stripe.config');

const prisma = new PrismaClient();
const createCustomer = async (customerData) => {
  return await stripe.customers.create(customerData);
};

const createPaymentIntent = async (userId, amount) => {
  // Get user from database
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  // Create payment intent
  return await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    customer: user.stripeId,
  });
};

module.exports = {
  createCustomer,
  createPaymentIntent,
};
