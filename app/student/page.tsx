'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Star, TrendingUp, User, Search } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStudentDashboardData } from '@/lib/actions/coachActions';

export default function StudentDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Hardcoded student ID for now
    const studentId = 'student_dummy_id';

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const result = await getStudentDashboardData(studentId);
            if (result.success) {
                setData(result.data);
            } else {
                // If student not found, we'll just show empty state for now
                setData({
                    stats: { rating: 1200, totalLessons: 0, activeCoaches: 0, hoursLearned: 0 },
                    upcomingLessons: [],
                    myCoaches: []
                });
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-xl text-muted-foreground animate-pulse">Loading your dashboard...</p>
            </div>
        );
    }

    const { stats, upcomingLessons, myCoaches } = data;

    const progressData = [
        { month: 'Start', rating: stats.rating - 50 },
        { month: 'Current', rating: stats.rating },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome back!</h1>
                    <p className="text-muted-foreground">Continue your chess journey</p>
                </div>
                <Link href="/student/coaches">
                    <Button variant="accent">
                        <Search className="w-4 h-4 mr-2" />
                        Find Coaches
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={TrendingUp} label="Current Rating" value={stats.rating.toString()} change="+0" color="text-green-500" />
                <StatCard icon={Calendar} label="Total Lessons" value={stats.totalLessons.toString()} change="+0" color="text-blue-500" />
                <StatCard icon={User} label="Active Coaches" value={stats.activeCoaches.toString()} change="" color="text-purple-500" />
                <StatCard icon={Clock} label="Hours Learned" value={stats.hoursLearned.toString()} change="+0" color="text-accent" />
            </div>

            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                    <p className="text-sm text-muted-foreground">Rating improvement over time</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
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
                            <Line type="monotone" dataKey="rating" stroke="var(--accent)" strokeWidth={3} name="Rating" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">Upcoming Lessons</h3>
                            <p className="text-sm text-muted-foreground">Your scheduled sessions</p>
                        </div>
                        <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingLessons.length > 0 ? upcomingLessons.map((lesson: any) => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-xl font-bold text-accent">
                                            {lesson.coach.user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{lesson.coach.user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(lesson.date).toLocaleDateString()} at {lesson.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-accent fill-accent" />
                                                <span className="text-sm font-semibold">{lesson.coach.rating}</span>
                                            </div>
                                        </div>
                                        <Button variant="accent" size="sm">Join</Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-muted-foreground">No upcoming lessons. Go find a coach!</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">My Coaches</h3>
                        <p className="text-sm text-muted-foreground">Coaches you have booked with</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myCoaches.length > 0 ? myCoaches.map((coach: any) => (
                                <div key={coach.id} className="p-4 border border-border rounded-lg hover:border-accent transition-colors">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-lg font-bold text-accent">
                                            {coach.user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{coach.user.name}</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-accent fill-accent" />
                                                <span className="text-xs text-muted-foreground">{coach.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/student/booking/${coach.id}`}>
                                        <Button variant="outline" size="sm" className="w-full mt-1">
                                            Book Again
                                        </Button>
                                    </Link>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground italic">You haven't booked any coaches yet.</p>
                            )}
                            <Link href="/student/coaches">
                                <Button variant="ghost" className="w-full mt-2">
                                    + Find More Coaches
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, change, color }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change && <p className="text-sm text-green-600 mt-1">{change} this month</p>}
                    </div>
                    <div className={`p-3 rounded-full bg-accent/10 ${color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
