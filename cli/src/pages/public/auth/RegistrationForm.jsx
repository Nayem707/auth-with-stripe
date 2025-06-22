import { useState } from 'react';
import PaymentForm from './PaymentForm';
import api from '../../../services/api';

const RegistrationForm = () => {
  const [step, setStep] = useState('userInfo');
  const [userData, setUserData] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setUserData(response.data);
      setStep('payment');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationComplete) {
    return (
      <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center'>
        <h2 className='text-2xl font-bold text-green-600 mb-4'>
          Registration Complete!
        </h2>
        <p className='mb-6'>Welcome to your dashboard, {userData.name}!</p>
        <button
          onClick={() => window.location.reload()}
          className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition'
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <PaymentForm
        userData={userData}
        onBack={() => setStep('userInfo')}
        onComplete={() => setRegistrationComplete(true)}
      />
    );
  }

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Full Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mb-6'>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'
        >
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
