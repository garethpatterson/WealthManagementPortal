import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, PieChart, Briefcase, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/portfolio', icon: PieChart },
    { name: 'Positions', path: '/positions', icon: Briefcase },
    { name: 'Documents', path: '/documents', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="font-semibold text-xl tracking-tight text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">WM</span>
            </div>
            Wealth Portal
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className={clsx("w-5 h-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                {currentUser?.email?.split('@')[0]}
              </span>
              <span className="text-xs text-muted-foreground">Client ID: 8192A</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
              title="Secure Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 md:hidden">
            <div className="font-semibold text-lg">Wealth Portal</div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#040D21] p-6 lg:p-10 relative">
          <div className="max-w-6xl mx-auto h-full space-y-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
