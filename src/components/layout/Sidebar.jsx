import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  Plug,
  Settings,
  Workflow,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutGrid, label: 'Overview' },
  { path: '/organisation', icon: Building2, label: 'Organisation' },
  { path: '/workflows', icon: Workflow, label: 'Workflows' },
  { path: '/app-connections', icon: Plug, label: 'App Connections' },
  { path: '/templates', icon: Layers, label: 'Templates' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = ({ isCollapsed, onToggle, mobileOpen, onCloseMobile }) => {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-50 h-screen border-r border-[#D8DFE9] bg-[#F6F5FA] transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#D8DFE9] px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D8DFE9] bg-[#CFDECA]">
              <Workflow size={20} className="text-[#212121]" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold leading-tight text-[#212121]">FlowForge</p>
                <p className="text-xs text-[#5C5C5C]">Enterprise Automation</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="hidden rounded-xl border border-[#D8DFE9] bg-white p-1.5 text-[#5C5C5C] hover:bg-[#EFF0A3] lg:inline-flex"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <button
              type="button"
              onClick={onCloseMobile}
              className="inline-flex rounded-xl border border-[#D8DFE9] bg-white p-1.5 text-[#5C5C5C] hover:bg-[#EFF0A3] lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <nav className="space-y-2 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors',
                  isCollapsed ? 'justify-center' : '',
                  isActive
                    ? 'border-[#CFDECA] bg-[#CFDECA] text-[#212121]'
                    : 'border-transparent bg-transparent text-[#5C5C5C] hover:border-[#D8DFE9] hover:bg-white hover:text-[#212121]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="absolute bottom-4 left-3 right-3 rounded-2xl border border-[#D8DFE9] bg-[#EFF0A3] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#212121]">Scale & Security</p>
            <p className="mt-1 text-sm text-[#5C5C5C]">
              Multi-team governance, secure token storage, and audit-ready workflow operations.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
