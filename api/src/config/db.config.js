const prisma = require('./prisma.config');

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection error', err);
    process.exit(1);
  }
};

module.exports = connectDB;
