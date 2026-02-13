import { 
  LayoutDashboard, Users, Calendar, DollarSign, MessageSquare, 
  Settings, LogOut, Award, BookOpen, Star, Bell, FileText,
  UserCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { cn } from '../components/ui/utils';
import { useState } from 'react';

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Coaches', path: '/admin/coaches' },
    { icon: UserCheck, label: 'Students', path: '/admin/students' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  const coachMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/coach' },
    { icon: Calendar, label: 'Schedule', path: '/coach/schedule' },
    { icon: BookOpen, label: 'Bookings', path: '/coach/bookings' },
    { icon: Users, label: 'Students', path: '/coach/students' },
    { icon: DollarSign, label: 'Earnings', path: '/coach/earnings' },
    { icon: MessageSquare, label: 'Messages', path: '/coach/messages' },
    { icon: Star, label: 'Reviews', path: '/coach/reviews' },
    { icon: Settings, label: 'Profile', path: '/coach/profile' }
  ];

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
    { icon: Users, label: 'Find Coaches', path: '/student/coaches' },
    { icon: Calendar, label: 'My Bookings', path: '/student/bookings' },
    { icon: MessageSquare, label: 'Messages', path: '/student/messages' },
    { icon: FileText, label: 'History', path: '/student/history' },
    { icon: Settings, label: 'Profile', path: '/student/profile' }
  ];

  const menuItems = user?.role === 'admin' 
    ? adminMenuItems 
    : user?.role === 'coach' 
    ? coachMenuItems 
    : studentMenuItems;

  return (
    <aside className={cn(
      "h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Award className="w-8 h-8 text-yellow-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">ChessCoach</span>
          </div>
        )}
        {collapsed && <Award className="w-8 h-8 text-yellow-600 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
