import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';

const PrivateLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold">RotaPerfeita</span>
          <nav className="flex gap-3 text-sm font-medium">
            <NavLink
              to="/app"
              className={({ isActive }) =>
                `px-3 py-1 rounded-md ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10'}`
              }
            >
              Dashboard
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md ${isActive ? 'bg-primary text-white' : 'hover:bg-primary/10'}`
                }
              >
                Administração
              </NavLink>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {user?.name} ({user?.role})
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
