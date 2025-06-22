import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Your authentication context

const PrivateRoute = () => {
  const { currentUser } = useAuth();

  // If not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
