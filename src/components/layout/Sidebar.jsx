import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Workflow,
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/workflows', icon: GitBranch, label: 'Workflows' },
    { path: '/create-workflow', icon: PlusCircle, label: 'Create Workflow' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)]
        transition-all duration-300 z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Workflow size={20} className="text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[var(--text-primary)]">
              FlowForge
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover)] transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${isCollapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-[var(--primary)] bg-opacity-10 text-[var(--sidebar-text-active)]'
                : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]'
              }
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;