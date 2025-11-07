import { Outlet } from 'react-router-dom';
import ThemeToggle from '../shared/ThemeToggle';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold">RotaPerfeita</h1>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PublicLayout;
