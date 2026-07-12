import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requireAdmin }) {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. If they have no token at all, kick them to the Login page
  if (!token) {
    alert("Please log in to access this page!");
    return <Navigate to="/login" replace />;
  }

  // 2. If the page requires an Admin, but the user is just a 'user', kick them Home
  if (requireAdmin && user?.usertype !== 'admin') {
    alert("Access Denied: You must be an Admin to view this page.");
    return <Navigate to="/" replace />;
  }

  // 3. If they pass the checks, let them in!
  return children;
}

export default ProtectedRoute;