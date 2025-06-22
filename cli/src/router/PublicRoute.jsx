import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Your authentication context

const PublicRoute = ({ restricted = false }) => {
  const { currentUser } = useAuth();

  // If route is restricted and user is logged in, redirect to home/dashboard
  if (restricted && currentUser) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
