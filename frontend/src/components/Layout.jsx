import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Layout({ title, links }) {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-medium mb-0">{title}</h1>
        <span className="fs-5">Welcome, {user?.username}</span>
      </div>

      <nav className="navbar navbar-expand bg-body-tertiary rounded px-4 py-3 mb-4 fs-5">
        <ul className="navbar-nav">
          {links.map((l) => (
            <li className="nav-item" key={l.to}>
              <NavLink to={l.to} end={l.end} className="nav-link">
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <button className="nav-link btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}
