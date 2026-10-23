import { useState } from 'react';
import { Link } from 'react-router-dom';

// Form dùng chung cho Login và Register
export default function AuthForm({ title, submitLabel, onSubmit, loading, error, footer, confirm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    if (!username.trim() || !password) return setLocalError('Please enter username and password');
    if (confirm && password !== confirmPassword) return setLocalError('Passwords do not match');
    onSubmit({ username: username.trim(), password });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '100%', maxWidth: 430 }}>
        <h4 className="text-center fw-bold mb-4">{title}</h4>
        {(localError || error) && <div className="alert alert-danger py-2">{localError || error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-group">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={confirm ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {confirm && (
            <div className="mb-3">
              <label className="form-label" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                type={show ? 'text' : 'password'}
                className="form-control form-control-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to={footer.to} className="text-decoration-none">{footer.text}</Link>
        </div>
      </div>
    </div>
  );
}
