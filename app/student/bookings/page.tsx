'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, FileText, ChevronRight, User } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for bookings
const allBookings = [
    {
        id: 1,
        coach: 'Grandmaster Alex',
        date: new Date(new Date().setHours(10, 0, 0, 0)),
        duration: 60,
        status: 'Confirmed',
        topic: 'Opening Repertoire',
        link: 'https://meet.google.com/abc-def-ghi',
    },
    {
        id: 2,
        coach: 'Sarah Jones',
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        duration: 90,
        status: 'Pending',
        topic: 'Middle Game Tactics',
        link: '',
    },
    {
        id: 3,
        coach: 'David Chen',
        date: new Date(new Date().setDate(new Date().getDate() - 5)),
        duration: 45,
        status: 'Completed',
        topic: 'Endgame Fundamentals',
        link: '',
    },
    {
        id: 4,
        coach: 'Elena Petrova',
        date: new Date(new Date().setDate(new Date().getDate() - 12)),
        duration: 60,
        status: 'Completed',
        topic: 'Attacking Principles',
        link: '',
    }
];

export default function StudentBookingsPage() {
    const upcomingBookings = allBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
    const pastBookings = allBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

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
