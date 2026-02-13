'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for bookings
const bookings = [
    {
        id: 'BK-001',
        student: 'John Smith',
        coach: 'Grandmaster Alex',
        date: '2023-11-15T10:00:00',
        duration: 60,
        status: 'Confirmed',
        amount: 50,
        topic: 'Opening Preparation',
    },
    {
        id: 'BK-002',
        student: 'Emily Davis',
        coach: 'IM Sarah Jones',
        date: '2023-11-16T14:30:00',
        duration: 90,
        status: 'Pending',
        amount: 75,
        topic: 'Endgame Analysis',
    },
    {
        id: 'BK-003',
        student: 'Michael Wilson',
        coach: 'Grandmaster Alex',
        date: '2023-11-14T09:00:00',
        duration: 60,
        status: 'Completed',
        amount: 50,
        topic: 'Strategy Review',
    },
    {
        id: 'BK-004',
        student: 'Sarah Johnson',
        coach: 'FM David Chen',
        date: '2023-11-18T16:00:00',
        duration: 45,
        status: 'Cancelled',
        amount: 40,
        topic: 'Tactical Puzzles',
    },
    {
        id: 'BK-005',
        student: 'Robert Brown',
        coach: 'WGM Elena Petrova',
        date: '2023-11-20T11:00:00',
        duration: 60,
        status: 'Confirmed',
        amount: 60,
        topic: 'Game Analysis',
    },
];

export default function AdminBookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBookings = bookings.filter(booking =>
        booking.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Confirmed':
                return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
            case 'Pending':
                return <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25 border-0"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'Completed':
                return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'Cancelled':
                return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-0"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bookings Overview</h1>
                    <p className="text-muted-foreground mt-1">Monitor and manage all coaching sessions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        Export Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Month)</CardTitle>
                        <span className="text-muted-foreground">$</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 since last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                        A comprehensive list of all platform bookings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search bookings..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Coach</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    {booking.student}
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.coach}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                                                    <span className="text-xs text-muted-foreground">{format(new Date(booking.date), 'h:mm a')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{booking.duration} min</TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell className="text-right font-medium">${booking.amount}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
