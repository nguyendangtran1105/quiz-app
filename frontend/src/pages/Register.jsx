import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { signup, clearError } from '../store/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (user) return <Navigate to={user.admin ? '/admin' : '/dashboard'} replace />;

  return (
    <AuthForm
      title="Register"
      submitLabel="Register"
      confirm
      loading={loading}
      error={error}
      onSubmit={(data) => dispatch(signup(data))}
      footer={{ to: '/login', text: 'Already have an account? Login here' }}
    />
  );
}
