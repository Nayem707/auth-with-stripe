import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import App from '../App';
// public routes 🔓
import PublicRoute from './PublicRoute';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// private routes 🔐
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../pages/private/DashboardLayout';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/*🔓 PublicRoute: If user is authenticated, redirect to dashboard */}
      <Route element={<PublicRoute />}>
        <Route path='/' element={<App />}>
          <Route index element={<HomePage />} />
          <Route index element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Route>
      </Route>

      {/*🔐 PrivateRoute: If user is not authenticated, redirect to login */}
      <Route element={<PrivateRoute />}>
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<HomeView />} />
          <Route path='users' element={<UserView />} />
          <Route path='projects' element={<ProjectsView />} />
          <Route path='add-product' element={<ProductsAddView />} />
          <Route path='product-list' element={<ProductsListView />} />
        </Route>
      </Route>
    </>
  )
);
