const Dashboard = ({ user }) => {
  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>
        Welcome to Your Dashboard
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h2 className='text-xl font-semibold text-blue-800 mb-2'>
            Account Information
          </h2>
          <p className='text-gray-700'>
            <span className='font-medium'>Name:</span> {user.name}
          </p>
          <p className='text-gray-700'>
            <span className='font-medium'>Email:</span> {user.email}
          </p>
        </div>

        <div className='bg-green-50 p-4 rounded-lg'>
          <h2 className='text-xl font-semibold text-green-800 mb-2'>
            Payment Status
          </h2>
          <p className='text-gray-700'>Your payment was successful!</p>
          <p className='text-gray-700 mt-2'>
            Stripe Customer ID: {user.stripeId}
          </p>
        </div>
      </div>

      <div className='mt-8'>
        <button
          onClick={() => console.log('Navigate to other features')}
          className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'
        >
          Explore Features
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
