import { Bell, Calendar, DollarSign, UserCheck, MessageSquare, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const notifications = [
  {
    id: 1,
    type: 'booking',
    icon: Calendar,
    title: 'Lesson Confirmed',
    message: 'Your lesson with GM Alexander Petrov is confirmed for Feb 15, 2026 at 10:00 AM',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'payment',
    icon: DollarSign,
    title: 'Payment Successful',
    message: 'Payment of $50 was processed successfully',
    time: '10 minutes ago',
    read: false,
  },
  {
    id: 3,
    type: 'message',
    icon: MessageSquare,
    title: 'New Message',
    message: 'IM Maria Silva sent you a message about your next lesson',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 4,
    type: 'review',
    icon: UserCheck,
    title: 'Review Request',
    message: 'Please rate your lesson with FM John Smith',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'booking',
    icon: Calendar,
    title: 'Upcoming Lesson',
    message: 'Reminder: Your lesson starts in 24 hours',
    time: '1 day ago',
    read: true,
  },
  {
    id: 6,
    type: 'success',
    icon: CheckCircle,
    title: 'Registration Complete',
    message: 'Welcome to ChessCoach! Start finding your perfect coach',
    time: '2 days ago',
    read: true,
  },
];

export function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your activity</p>
        </div>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:border-accent transition-colors ${
              !notification.read ? 'bg-accent/5 border-accent/50' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-full ${
                  notification.type === 'booking' ? 'bg-blue-500/10 text-blue-600' :
                  notification.type === 'payment' ? 'bg-green-500/10 text-green-600' :
                  notification.type === 'message' ? 'bg-purple-500/10 text-purple-600' :
                  notification.type === 'review' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-accent/10 text-accent'
                }`}>
                  <notification.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{notification.title}</h4>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{notification.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (if no notifications) */}
      {notifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
