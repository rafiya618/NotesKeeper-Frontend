import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ element: Component }) => {
  let {user}=useContext(AuthContext)
  const isAuthenticated = false // Replace with your actual authentication logic

  return user ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;
