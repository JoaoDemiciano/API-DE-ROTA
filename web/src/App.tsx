import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PublicLayout from './components/layout/PublicLayout';
import PrivateLayout from './components/layout/PrivateLayout';

const App = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Routes>
        <Route element={<PublicLayout />}> 
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/app" />} />
          <Route path="/registro" element={!user ? <RegisterPage /> : <Navigate to="/app" />} />
        </Route>
        <Route
          element={
            user ? <PrivateLayout /> : <Navigate to="/login" replace state={{ from: window.location }} />
          }
        >
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminPage /> : <Navigate to="/app" />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/app' : '/login'} />} />
      </Routes>
    </div>
  );
};

export default App;
