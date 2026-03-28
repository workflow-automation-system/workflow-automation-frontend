import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Sun, Moon, LogOut, User, ChevronRight } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/' }];

    paths.forEach((path, index) => {
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({
        label,
        path: `/${paths.slice(0, index + 1).join('/')}`,
      });
    });

    return breadcrumbs;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/workflows') return 'Workflows';
    if (path === '/create-workflow') return 'Create Workflow';
    if (path.startsWith('/workflow/')) return 'Workflow Details';
    if (path === '/settings') return 'Settings';
    return '';
  };

  return (
    <header className="fixed top-0 right-0 h-16 bg-[var(--background)] border-b border-[var(--border)] flex items-center justify-between px-6 z-30"
      style={{ left: 'var(--sidebar-width, 16rem)' }}
    >
      {/* Breadcrumbs / Page Title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          {getPageTitle()}
        </h1>
        <nav className="flex items-center gap-1 text-sm">
          {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && <ChevronRight size={14} className="text-[var(--text-muted)]" />}
              <button
                onClick={() => navigate(crumb.path)}
                className={`hover:text-[var(--primary)] transition-colors ${
                  index === getBreadcrumbs().length - 1
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
              </div>
              <div className="px-4 py-6 text-center text-[var(--text-secondary)]">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {user?.name || 'User'}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg">
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                >
                  <User size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;