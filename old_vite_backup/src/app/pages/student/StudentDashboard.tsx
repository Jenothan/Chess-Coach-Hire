import { Link } from 'react-router';
import { Calendar, Clock, Star, TrendingUp, User, Search } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const progressData = [
  { month: 'Jan', rating: 1200 },
  { month: 'Feb', rating: 1280 },
  { month: 'Mar', rating: 1350 },
  { month: 'Apr', rating: 1420 },
  { month: 'May', rating: 1480 },
  { month: 'Jun', rating: 1550 },
];

const upcomingLessons = [
  { id: 1, coach: 'GM Alexander Petrov', rating: 2650, time: '10:00 AM', date: '2026-02-15', type: 'Opening Theory' },
  { id: 2, coach: 'IM Maria Silva', rating: 2450, time: '2:00 PM', date: '2026-02-16', type: 'Endgame Mastery' },
  { id: 3, coach: 'FM John Smith', rating: 2350, time: '4:00 PM', date: '2026-02-18', type: 'Tactics Training' },
];

const myCoaches = [
  { id: 1, name: 'GM Alexander Petrov', rating: 2650, lessons: 12, nextLesson: '2026-02-15', image: '🏆' },
  { id: 2, name: 'IM Maria Silva', rating: 2450, lessons: 8, nextLesson: '2026-02-16', image: '👑' },
];

const recentLessons = [
  { id: 1, coach: 'GM Alexander Petrov', date: '2026-02-08', topic: 'Sicilian Defense', rating: 5 },
  { id: 2, coach: 'IM Maria Silva', date: '2026-02-06', topic: 'Rook Endgames', rating: 5 },
  { id: 3, coach: 'FM John Smith', date: '2026-02-05', topic: 'Tactical Patterns', rating: 4 },
];

export function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Continue your chess journey</p>
        </div>
        <Link to="/student/coaches">
          <Button variant="accent">
            <Search className="w-4 h-4 mr-2" />
            Find Coaches
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Current Rating', value: '1550', change: '+70', color: 'text-green-500' },
          { icon: Calendar, label: 'Total Lessons', value: '23', change: '+3', color: 'text-blue-500' },
          { icon: User, label: 'Active Coaches', value: '2', change: '', color: 'text-purple-500' },
          { icon: Clock, label: 'Hours Learned', value: '34.5', change: '+4.5', color: 'text-accent' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                  )}
                </div>
                <div className={`p-3 rounded-full bg-accent/10 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <h3>Your Progress</h3>
          <p className="text-sm text-muted-foreground">Rating improvement over time</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="rating" stroke="#D4AF37" strokeWidth={3} name="Rating" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Lessons */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3>Upcoming Lessons</h3>
              <p className="text-sm text-muted-foreground">Your scheduled sessions</p>
            </div>
            <Link to="/student/bookings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-xl">
                      {lesson.coach[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{lesson.coach}</p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.date} at {lesson.time}
                      </p>
                      <p className="text-xs text-accent">{lesson.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm font-semibold">{lesson.rating}</span>
                      </div>
                    </div>
                    <Button variant="accent" size="sm">Join</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Coaches */}
        <Card>
          <CardHeader>
            <h3>My Coaches</h3>
            <p className="text-sm text-muted-foreground">Your current coaches</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myCoaches.map((coach) => (
                <div key={coach.id} className="p-4 border border-border rounded-lg hover:border-accent transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-2xl">
                      {coach.image}
                    </div>
                    <div>
                      <p className="font-semibold">{coach.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-xs text-muted-foreground">{coach.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{coach.lessons} lessons completed</p>
                    <p>Next: {coach.nextLesson}</p>
                  </div>
                  <Link to={`/student/booking/${coach.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Book Lesson
                    </Button>
                  </Link>
                </div>
              ))}
              <Link to="/student/coaches">
                <Button variant="ghost" className="w-full">
                  + Find More Coaches
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Lessons */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3>Recent Lessons</h3>
            <p className="text-sm text-muted-foreground">Your lesson history</p>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-semibold">{lesson.topic}</p>
                  <p className="text-sm text-muted-foreground">
                    with {lesson.coach} • {lesson.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < lesson.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
