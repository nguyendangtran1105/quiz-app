import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import Article from './pages/Article';
import ManageQuestions from './pages/ManageQuestions';

const userLinks = [
  { to: '/dashboard', label: 'Home', end: true },
  { to: '/dashboard/quiz', label: 'Quiz' },
  { to: '/dashboard/article', label: 'Article' },
];
const adminLinks = [
  { to: '/admin', label: 'Home', end: true },
  { to: '/admin/questions', label: 'Manage Questions' },
  { to: '/admin/articles', label: 'Manage Articles' },
];

function RootRedirect() {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.admin ? '/admin' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User thường: chỉ làm quiz */}
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/dashboard" element={<Layout title="Dashboard" links={userLinks} />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="article" element={<Article />} />
        </Route>
      </Route>

      {/* Admin: CRUD câu hỏi */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<Layout title="Admin Dashboard" links={adminLinks} />}>
          <Route index element={<Home />} />
          <Route path="questions" element={<ManageQuestions />} />
          <Route path="articles" element={<Article />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
