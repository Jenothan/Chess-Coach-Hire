'use client';

import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Star, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCoachDashboardData } from '@/lib/actions/coachActions';

export default function CoachDashboard() {
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'requests'>('upcoming');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Get coach ID from localStorage or fallback to hardcoded (for existing mock system)
    const [coachId, setCoachId] = useState<string>('coach_alex_123');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setCoachId(storedUserId);
        }
    }, []);

    useEffect(() => {
        if (!coachId) return;

        async function fetchData() {
            setLoading(true);
            const result = await getCoachDashboardData(coachId);
            if (result.success) {
                setData(result.data);
            }
            setLoading(false);
        }
        fetchData();
    }, [coachId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-xl text-muted-foreground animate-pulse">Loading dashboard data...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <p className="text-xl text-destructive">Error loading dashboard. Please try again.</p>
            </div>
        );
    }

    const { stats, upcomingLessons, pendingRequests } = data;

    // Example chart data - in a real app, this would also come from the database
    const earningsData = [
        { month: 'Current', earnings: stats.monthlyEarnings },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome back!</h1>
                    <p className="text-muted-foreground">Manage your schedule and students</p>
                </div>
                <Button variant="accent">Set Availability</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Active Students" value={stats.activeStudents.toString()} color="text-blue-500" />
                <StatCard icon={Calendar} label="Upcoming Lessons" value={stats.weeklyLessons.toString()} color="text-green-500" />
                <StatCard icon={DollarSign} label="Total Earnings" value={`$${stats.monthlyEarnings}`} color="text-accent" />
                <StatCard icon={Star} label="Average Rating" value={stats.rating.toString()} color="text-yellow-500" />
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Earnings Summary</h3>
                    <p className="text-sm text-muted-foreground">Your earnings trend from confirmed bookings</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={earningsData}>
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
                            <Bar dataKey="earnings" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">{selectedTab === 'upcoming' ? 'Upcoming Lessons' : 'Booking Requests'}</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedTab === 'upcoming' ? 'Your scheduled lessons' : 'Pending approval'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={selectedTab === 'upcoming' ? 'accent' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTab('upcoming')}
                            >
                                Upcoming
                            </Button>
                            <Button
                                variant={selectedTab === 'requests' ? 'accent' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTab('requests')}
                            >
                                Requests ({pendingRequests.length})
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedTab === 'upcoming' ? (
                        <div className="space-y-3">
                            {upcomingLessons.length > 0 ? upcomingLessons.map((lesson: any) => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{lesson.student.user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(lesson.date).toLocaleDateString()} at {lesson.time} • {lesson.duration} min
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm px-3 py-1 rounded-full bg-green-500/10 text-green-600">
                                            {lesson.status}
                                        </span>
                                        <Button variant="outline" size="sm">Join</Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-muted-foreground">No upcoming lessons.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingRequests.length > 0 ? pendingRequests.map((request: any) => (
                                <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{request.student.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {request.type || 'Single Lesson'} • {new Date(request.date).toLocaleDateString()} at {request.time}
                                        </p>
                                        <p className="text-sm font-semibold text-accent mt-1">${request.amount}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="accent" size="sm">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Accept
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-muted-foreground">No pending requests.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-accent/10 ${color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
