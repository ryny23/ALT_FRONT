import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est connecté

  return isLoggedIn ? children : <Navigate to="/authform" />;
};

export default ProtectedRoute;
