import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { login, clearError } from '../store/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Đăng nhập xong: admin -> /admin, user -> /dashboard
  if (user) return <Navigate to={user.admin ? '/admin' : '/dashboard'} replace />;

  return (
    <AuthForm
      title="Login"
      submitLabel="Login"
      loading={loading}
      error={error}
      onSubmit={(data) => dispatch(login(data))}
      footer={{ to: '/register', text: "Don't have an account? Register here" }}
    />
  );
}
