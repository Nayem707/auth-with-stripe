import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import RegistrationForm from './pages/public/auth/RegistrationForm';

const stripePromise = loadStripe(
  'pk_test_51RcJiND60jTqpzFUTyaTS0m8gzJ8dJUoCMfzokDmF8UKWIKgzdoguwKoRuB1o1QOhzHKtUiRh7Q4TWURblIAzbtS00UT4FOEQx'
);

function App() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <Elements stripe={stripePromise}>
          <RegistrationForm />
        </Elements>
      </div>
    </div>
  );
}

export default App;
