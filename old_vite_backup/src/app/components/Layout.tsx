import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../../lib/utils';

interface LayoutProps {
  role: 'admin' | 'coach' | 'student';
}

export function Layout({ role }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const adminNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Coaches', path: '/admin/coaches' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const coachNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
    { icon: Calendar, label: 'Schedule', path: '/coach/schedule' },
    { icon: Users, label: 'Students', path: '/coach/students' },
    { icon: DollarSign, label: 'Earnings', path: '/coach/earnings' },
    { icon: Settings, label: 'Profile', path: '/coach/profile' },
  ];

  const studentNav = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: Users, label: 'Find Coaches', path: '/student/coaches' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
    { icon: Crown, label: 'My Coaches', path: '/student/my-coaches' },
    { icon: Settings, label: 'Profile', path: '/student/profile' },
  ];

  const navigation = role === 'admin' ? adminNav : role === 'coach' ? coachNav : studentNav;
  const basePath = `/${role}`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground',
          'transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-sidebar-primary" />
                <span className="text-xl font-bold">ChessCoach</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-sidebar-accent rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-sidebar-border space-y-1">
            <Link
              to={`${basePath}/notifications`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>
            <Link
              to={`${basePath}/help`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors text-destructive"
              onClick={() => setSidebarOpen(false)}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex-none"></div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-accent rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {role === 'admin' ? 'A' : role === 'coach' ? 'C' : 'S'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}