'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, FileText, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';

import { useState, useEffect } from 'react';
import { getStudentBookings } from '@/lib/actions/coachActions';

export default function StudentBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            setLoading(true);
            const result = await getStudentBookings(userId!);
            if (result.success) {
                setBookings(result.data || []);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const upcomingBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
    const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-xl text-muted-foreground animate-pulse">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-muted-foreground mt-1">Manage your upcoming lessons and view history.</p>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6 space-y-4">
                    {upcomingBookings.length > 0 ? (
                        upcomingBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
                        ))
                    ) : (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-medium">No upcoming bookings</h3>
                            <p className="text-muted-foreground mb-4">You don't have any lessons scheduled.</p>
                            <Button>Find a Coach</Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                    {pastBookings.length > 0 ? (
                        pastBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                        ))
                    ) : (
                        <div className="text-center py-12 border rounded-lg bg-muted/10">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-medium">No past bookings</h3>
                            <p className="text-muted-foreground">Your completed lessons will appear here.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function BookingCard({ booking, isUpcoming }: { booking: any, isUpcoming: boolean }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{booking.topic}</h3>
                                <Badge variant={booking.status === 'Confirmed' ? 'default' : booking.status === 'Pending' ? 'secondary' : 'outline'} className={booking.status === 'Confirmed' ? 'bg-green-500/15 text-green-700 dark:text-green-400 border-0' : ''}>
                                    {booking.status}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-1 mb-2">
                                with <span className="font-medium text-foreground">{booking.coach}</span>
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {format(booking.date, 'EEEE, MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {format(booking.date, 'h:mm a')} ({booking.duration} min)
                                </div>
                                <div className="flex items-center gap-1 font-semibold text-emerald-600">
                                    LKR {booking.amount}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto mt-2 md:mt-0">
                        {isUpcoming && booking.status === 'Confirmed' && (
                            <Button className="w-full md:w-auto">
                                <Video className="w-4 h-4 mr-2" /> Join Lesson
                            </Button>
                        )}
                        {isUpcoming && booking.status === 'Pending' && (
                            <Button variant="outline" className="w-full md:w-auto" disabled>
                                Awaiting Confirmation
                            </Button>
                        )}
                        {!isUpcoming && (
                            <Button variant="outline" className="w-full md:w-auto">
                                View Notes
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
