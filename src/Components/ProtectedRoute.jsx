import React from 'react';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est connecté

  return isLoggedIn ? children : <Link to="/authform" />;
};

export default ProtectedRoute;
