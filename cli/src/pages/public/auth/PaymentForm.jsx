import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../../services/api';

const PaymentForm = ({ userData, onBack, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const {
        data: { clientSecret },
      } = await api.createPaymentIntent({
        userId: userData.id,
        amount: 1000, // $10.00 in cents
      });

      // Confirm payment
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userData.name,
              email: userData.email,
            },
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onComplete();
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>
        Payment Information
      </h2>

      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && <div className='text-red-500 mb-4 text-sm'>{error}</div>}

        <div className='flex justify-between'>
          <button
            type='button'
            onClick={onBack}
            disabled={loading}
            className='bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition'
          >
            Back
          </button>
          <button
            type='submit'
            disabled={!stripe || loading}
            className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'
          >
            {loading ? 'Processing...' : `Pay $10.00`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
