'use client';

import { useState, useEffect } from 'react';
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
import { getBookingsData } from '@/lib/actions/adminActions';

export default function AdminBookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getBookingsData();
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredBookings = bookings.filter(booking =>
        booking.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED':
                return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25 border-0"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25 border-0"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate dynamic stats
    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const activeBookings = bookings.filter(b => b.status.toUpperCase() === 'CONFIRMED' || b.status.toUpperCase() === 'PENDING').length;
    const pendingRequests = bookings.filter(b => b.status.toUpperCase() === 'PENDING').length;

    if (loading) return <div className="p-8 text-center">Loading bookings...</div>;

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
                        <CardTitle className="text-sm font-medium">Total Revenue (All Time)</CardTitle>
                        <span className="text-muted-foreground text-xs font-bold">LKR</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">LKR {totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Calculated from all bookings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active/Upcoming Bookings</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeBookings}</div>
                        <p className="text-xs text-muted-foreground">Confirmed and pending sessions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingRequests}</div>
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
                                            <TableCell className="text-right font-medium">LKR {booking.amount}</TableCell>
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
