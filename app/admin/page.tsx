'use client';

import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
    { month: 'Jan', revenue: 45000, bookings: 320 },
    { month: 'Feb', revenue: 52000, bookings: 380 },
    { month: 'Mar', revenue: 48000, bookings: 350 },
    { month: 'Apr', revenue: 61000, bookings: 420 },
    { month: 'May', revenue: 58000, bookings: 400 },
    { month: 'Jun', revenue: 65000, bookings: 450 },
];

const coachData = [
    { name: 'Active', value: 234, color: '#D4AF37' },
    { name: 'Pending', value: 45, color: '#FFA500' },
    { name: 'Suspended', value: 12, color: '#FF4444' },
];

const recentCoaches = [
    { id: 1, name: 'GM Alexander Petrov', rating: 2650, status: 'pending', date: '2026-02-10' },
    { id: 2, name: 'IM Maria Silva', rating: 2450, status: 'pending', date: '2026-02-11' },
    { id: 3, name: 'FM John Smith', rating: 2350, status: 'approved', date: '2026-02-11' },
    { id: 4, name: 'CM Sarah Johnson', rating: 2200, status: 'pending', date: '2026-02-12' },
];

const recentBookings = [
    { id: 1, student: 'David Lee', coach: 'GM Alexander', date: '2026-02-15', amount: '$50', status: 'confirmed' },
    { id: 2, student: 'Emma Wilson', coach: 'IM Maria Silva', date: '2026-02-15', amount: '$45', status: 'confirmed' },
    { id: 3, student: 'Michael Brown', coach: 'FM John Smith', date: '2026-02-16', amount: '$40', status: 'pending' },
    { id: 4, student: 'Sophie Chen', coach: 'CM Sarah Johnson', date: '2026-02-16', amount: '$35', status: 'confirmed' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your chess coaching platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: Users, label: 'Total Coaches', value: '291', change: '+12', color: 'text-blue-500' },
                    { icon: UserCheck, label: 'Total Students', value: '3,847', change: '+234', color: 'text-green-500' },
                    { icon: Calendar, label: 'Total Bookings', value: '12,450', change: '+89', color: 'text-purple-500' },
                    { icon: DollarSign, label: 'Revenue (MTD)', value: '$65,420', change: '+18%', color: 'text-accent' },
                ].map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                                </div>
                                <div className={`p-3 rounded-full bg-accent/10 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3>Revenue & Bookings Trend</h3>
                        <p className="text-sm text-muted-foreground">Last 6 months performance</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
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
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} name="Revenue ($)" />
                                <Line type="monotone" dataKey="bookings" stroke="#4CAF50" strokeWidth={2} name="Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <h3>Coach Status Distribution</h3>
                        <p className="text-sm text-muted-foreground">Current coach breakdown</p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={coachData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {coachData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Tables */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Coach Approvals */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h3>Pending Coach Approvals</h3>
                            <p className="text-sm text-muted-foreground">Review and approve new coaches</p>
                        </div>
                        <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentCoaches.map((coach) => (
                                <div key={coach.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{coach.name}</p>
                                        <p className="text-sm text-muted-foreground">Rating: {coach.rating} • {coach.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {coach.status === 'pending' ? (
                                            <>
                                                <Button variant="accent" size="sm">Approve</Button>
                                                <Button variant="destructive" size="sm">Reject</Button>
                                            </>
                                        ) : (
                                            <span className="text-sm text-green-600 font-semibold">Approved</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <h3>Recent Bookings</h3>
                            <p className="text-sm text-muted-foreground">Latest booking activity</p>
                        </div>
                        <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{booking.student}</p>
                                        <p className="text-sm text-muted-foreground">with {booking.coach}</p>
                                        <p className="text-sm text-muted-foreground">{booking.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{booking.amount}</p>
                                        <span className={`text-sm ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
