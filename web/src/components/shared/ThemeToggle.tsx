import { useTheme } from '../../contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800"
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      <span className="text-sm">{theme === 'dark' ? 'Claro' : 'Escuro'}</span>
    </button>
  );
};

export default ThemeToggle;
