const prisma = require('../config/prisma.config');
const stripeService = require('./stripe.service');

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const createUser = async (userData) => {
  // Create Stripe customer first
  const stripeCustomer = await stripeService.createCustomer({
    email: userData.email,
    name: userData.name,
  });

  // Then create user with Stripe ID
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      stripeId: stripeCustomer.id,
    },
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};
