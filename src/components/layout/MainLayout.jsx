import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useAuthStore from '../../stores/authStore';

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[#292D32]">
      <Sidebar />
      <Navbar />
      <main className="min-h-screen pt-16 pl-20">
        <div className="mx-auto w-full max-w-[1800px] p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;