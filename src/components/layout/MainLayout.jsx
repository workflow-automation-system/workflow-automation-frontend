import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../stores/authStore';
import useThemeStore from '../../stores/themeStore';

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    initTheme();
  }, [initTheme]);

  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[#212121]">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      <main
        className={[
          'min-h-screen pt-16 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72',
        ].join(' ')}
      >
        <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
