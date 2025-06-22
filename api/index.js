require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Middleware to authenticate JWT
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token)
    return res.status(401).send({ error: 'Access denied, token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Try to find user by uid or id depending on your model
    const user = await prisma.user.findUnique({
      where: { uid: decoded.uid } || { id: decoded.uid },
    });

    if (!user)
      return res.status(401).send({ error: 'Invalid token, user not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'Invalid or expired token' });
  }
};

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ error: 'All fields are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isPaymentSetup: false,
      },
    });

    const token = jwt.sign(
      { uid: user.uid ?? user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.status(201).send({
      token,
      user: {
        uid: user.uid ?? user.id,
        name: user.name,
        email: user.email,
        isPaymentSetup: user.isPaymentSetup,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send({ error: 'Something went wrong. Please try again.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({ error: 'Email and password required.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).send({ error: 'Invalid credentials.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(400).send({ error: 'Invalid credentials.' });

    const token = jwt.sign(
      { uid: user.uid ?? user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.send({
      token,
      user: {
        uid: user.uid ?? user.id,
        name: user.name,
        email: user.email,
        isPaymentSetup: user.isPaymentSetup,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send({ error: 'Something went wrong. Please try again.' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateJWT, async (req, res) => {
  res.send({
    uid: req.user.uid ?? req.user.id,
    name: req.user.name,
    email: req.user.email,
    isPaymentSetup: req.user.isPaymentSetup,
    createdAt: req.user.createdAt,
  });
});

// Create payment
app.post('/api/payments', authenticateJWT, async (req, res) => {
  try {
    const { amount, paymentDate, transactionId } = req.body;

    if (!amount || !paymentDate || !transactionId) {
      return res
        .status(400)
        .send({ error: 'All payment fields are required.' });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId: req.user.id,
        amount: Number(amount),
        paymentDate: new Date(paymentDate),
        transactionId,
      },
    });

    // Update user's payment status
    await prisma.user.update({
      where: { id: req.user.id },
      data: { isPaymentSetup: true },
    });

    res.status(201).send({
      ...payment,
      isPaymentSetup: true,
    });
  } catch (err) {
    console.error('Payment creation error:', err);
    res.status(500).send({ error: 'Failed to create payment.' });
  }
});

// Get payment history
app.get('/api/payments', authenticateJWT, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { paymentDate: 'desc' },
    });
    res.send(payments);
  } catch (err) {
    console.error('Payment fetch error:', err);
    res.status(500).send({ error: 'Failed to fetch payments.' });
  }
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
