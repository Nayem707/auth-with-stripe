import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1/auth'; // Your backend URL

const api = {
  registerUser: (userData) => axios.post(`${API_BASE_URL}/register`, userData),
  createPaymentIntent: (paymentData) =>
    axios.post(`${API_BASE_URL}/create-payment-intent`, paymentData),
};

export default api;
