import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  // Initialize theme on mount
  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Navbar />
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'pl-16' : 'pl-64'}
        `}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;