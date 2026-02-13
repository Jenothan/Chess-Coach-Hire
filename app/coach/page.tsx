'use client';

import { useState } from 'react';
import { Calendar, DollarSign, Users, Star, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
    { month: 'Jan', earnings: 3200 },
    { month: 'Feb', earnings: 3800 },
    { month: 'Mar', earnings: 3500 },
    { month: 'Apr', earnings: 4200 },
    { month: 'May', earnings: 4500 },
    { month: 'Jun', earnings: 4800 },
];

const upcomingLessons = [
    { id: 1, student: 'David Lee', time: '10:00 AM', date: '2026-02-15', duration: '60 min', status: 'confirmed' },
    { id: 2, student: 'Emma Wilson', time: '2:00 PM', date: '2026-02-15', duration: '60 min', status: 'confirmed' },
    { id: 3, student: 'Michael Brown', time: '4:00 PM', date: '2026-02-15', duration: '90 min', status: 'confirmed' },
    { id: 4, student: 'Sophie Chen', time: '11:00 AM', date: '2026-02-16', duration: '60 min', status: 'pending' },
];

const pendingRequests = [
    { id: 1, student: 'Alex Johnson', type: 'Single Lesson', date: '2026-02-18', time: '3:00 PM', amount: '$50' },
    { id: 2, student: 'Lisa Wang', type: 'Monthly Plan', date: '2026-02-20', time: '10:00 AM', amount: '$400' },
    { id: 3, student: 'James Miller', type: 'Single Lesson', date: '2026-02-22', time: '1:00 PM', amount: '$50' },
];

export default function CoachDashboard() {
    const [selectedTab, setSelectedTab] = useState<'upcoming' | 'requests'>('upcoming');

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="mb-2">Welcome back, Coach!</h1>
                    <p className="text-muted-foreground">Manage your schedule and students</p>
                </div>
                <Button variant="accent">Set Availability</Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: Users, label: 'Active Students', value: '24', color: 'text-blue-500' },
                    { icon: Calendar, label: 'This Week Lessons', value: '18', color: 'text-green-500' },
                    { icon: DollarSign, label: 'This Month Earnings', value: '$4,800', color: 'text-accent' },
                    { icon: Star, label: 'Average Rating', value: '4.9', color: 'text-yellow-500' },
                ].map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-accent/10 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Earnings Chart */}
            <Card>
                <CardHeader>
                    <h3>Monthly Earnings</h3>
                    <p className="text-sm text-muted-foreground">Your earnings trend over time</p>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
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
                            <Bar dataKey="earnings" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3>{selectedTab === 'upcoming' ? 'Upcoming Lessons' : 'Booking Requests'}</h3>
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
                                Requests (3)
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedTab === 'upcoming' ? (
                        <div className="space-y-3">
                            {upcomingLessons.map((lesson) => (
                                <div key={lesson.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{lesson.student}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.date} at {lesson.time} • {lesson.duration}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm px-3 py-1 rounded-full ${lesson.status === 'confirmed'
                                            ? 'bg-green-500/10 text-green-600'
                                            : 'bg-yellow-500/10 text-yellow-600'
                                            }`}>
                                            {lesson.status}
                                        </span>
                                        <Button variant="outline" size="sm">Join</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{request.student}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {request.type} • {request.date} at {request.time}
                                        </p>
                                        <p className="text-sm font-semibold text-accent mt-1">{request.amount}</p>
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
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
