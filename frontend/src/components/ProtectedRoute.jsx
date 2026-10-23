import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// role="admin": chỉ admin; role="user": chỉ user thường (admin bị chuyển về /admin)
export default function ProtectedRoute({ role }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'admin' && !user.admin) return <Navigate to="/dashboard" replace />;
  if (role === 'user' && user.admin) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
