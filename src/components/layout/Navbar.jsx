import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  Workflow,
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const routeToTitle = {
  '/': 'Overview',
  '/organisation': 'Organisation',
  '/workflows': 'Workflows',
  '/app-connections': 'App Connections',
  '/templates': 'Templates',
  '/settings': 'Settings',
  '/create-workflow': 'Workflows',
};

const Navbar = ({ sidebarCollapsed, onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    setShowUserMenu(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const getPageTitle = React.useCallback(() => {
    if (location.pathname.startsWith('/workflow/')) {
      return 'Workflows';
    }

    return routeToTitle[location.pathname] || 'Overview';
  }, [location.pathname]);

  const breadcrumbs = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);
    const items = [{ label: 'Overview', path: '/' }];

    paths.forEach((segment, index) => {
      const title = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      items.push({
        label: title,
        path: `/${paths.slice(0, index + 1).join('/')}`,
      });
    });

    return items;
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className={[
        'fixed top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#D8DFE9] bg-[#F6F5FA]/95 px-4 backdrop-blur-sm sm:px-6',
        sidebarCollapsed ? 'lg:left-20 lg:w-[calc(100%-5rem)]' : 'lg:left-72 lg:w-[calc(100%-18rem)]',
      ].join(' ')}
    >
      <div className="relative z-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex rounded-xl border border-[#D8DFE9] bg-white p-2 text-[#5C5C5C] hover:bg-[#EFF0A3] lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8DFE9] bg-[#CFDECA]">
              <Workflow className="h-4 w-4 text-[#212121]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#212121] sm:text-lg">{getPageTitle()}</h1>
              <nav className="hidden items-center gap-1 text-xs text-[#8A8A8A] md:flex">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                    <button
                      type="button"
                      onClick={() => navigate(crumb.path)}
                      className={
                        index === breadcrumbs.length - 1
                          ? 'font-medium text-[#212121]'
                          : 'hover:text-[#212121]'
                      }
                    >
                      {crumb.label}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-[#D8DFE9] bg-white p-2 text-[#5C5C5C] hover:bg-[#EFF0A3]"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative rounded-xl border border-[#D8DFE9] bg-white p-2 text-[#5C5C5C] hover:bg-[#EFF0A3]"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#22C55E]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#D8DFE9] bg-[#F6F5FA] shadow-xl">
                <div className="border-b border-[#D8DFE9] px-4 py-3">
                  <h3 className="text-sm font-semibold text-[#212121]">Notifications</h3>
                  <p className="text-xs text-[#5C5C5C]">All workflow systems are healthy.</p>
                </div>
                <div className="px-4 py-5 text-sm text-[#5C5C5C]">
                  No unread notifications.
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-[#D8DFE9] bg-white px-2 py-1.5 hover:bg-[#EFF0A3]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D8DFE9] text-xs font-semibold text-[#212121]">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-[#212121]">{user?.name || 'User'}</p>
                <p className="text-[11px] text-[#5C5C5C]">{user?.email || 'user@company.com'}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#D8DFE9] bg-[#F6F5FA] shadow-xl">
                <div className="border-b border-[#D8DFE9] px-4 py-3">
                  <p className="text-sm font-medium text-[#212121]">{user?.name || 'User'}</p>
                  <p className="text-xs text-[#5C5C5C]">{user?.email || 'user@company.com'}</p>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => navigate('/settings')}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#212121] hover:bg-white"
                  >
                    <User size={16} />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#EF4444] hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
