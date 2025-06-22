const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./user.service');

const registerUser = async (userData) => {
  const { email, password, name, isPaymentSetup } = userData;

  // Check if user exists
  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    stripeId: user.stripeId,
    token,
  };
};

const loginUser = async (email, password) => {
  const user = await userService.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    stripeId: user.stripeId,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
