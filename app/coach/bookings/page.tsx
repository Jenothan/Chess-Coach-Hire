'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getCoachBookings, updateBookingStatus } from '@/lib/actions/coachActions';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [coachId, setCoachId] = useState<string>('');

    useEffect(() => {
        const storedCoachId = localStorage.getItem('coachId');
        const storedUserId = localStorage.getItem('userId');
        if (storedCoachId) setCoachId(storedCoachId);
        else if (storedUserId) setCoachId(storedUserId);
    }, []);

    const fetchBookings = async () => {
        if (!coachId) return;
        setLoading(true);
        const result = await getCoachBookings(coachId);
        if (result.success) {
            setBookings(result.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, [coachId]);

    const handleAction = async (bookingId: string, status: string) => {
        const result = await updateBookingStatus(bookingId, status);
        if (result.success) {
            toast.success(`Booking ${status === 'confirmed' ? 'accepted' : 'declined'}`);
            fetchBookings();
        } else {
            toast.error("Failed to update booking");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 uppercase text-[10px] font-bold">Pending</Badge>;
            case 'confirmed': return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 uppercase text-[10px] font-bold">Confirmed</Badge>;
            case 'rejected': return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200 uppercase text-[10px] font-bold">Rejected</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] font-bold">{status}</Badge>;
        }
    };

    if (loading && bookings.length === 0) {
        return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
    }

    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const historyBookings = bookings.filter(b => b.status !== 'pending');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
                <p className="text-muted-foreground mt-1">Manage lesson requests and view your history.</p>
            </div>

            <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-accent/5 p-1">
                    <TabsTrigger value="requests" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
                        Requests {pendingBookings.length > 0 && <Badge variant="accent" className="ml-2 h-5 w-5 p-0 flex items-center justify-center shrink-0">{pendingBookings.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">History</TabsTrigger>
                </TabsList>

                <TabsContent value="requests" className="mt-0">
                    <Card className="glass-card overflow-hidden">
                        <CardHeader>
                            <CardTitle>Lesson Requests</CardTitle>
                            <CardDescription>Review and respond to new booking requests from students.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingBookings.length > 0 ? pendingBookings.map((booking) => (
                                    <div key={booking.id} className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <Avatar className="h-12 w-12 border-2 border-accent/20">
                                                <AvatarImage src={booking.student.user.image || ""} />
                                                <AvatarFallback className="bg-accent/10 text-accent font-bold">
                                                    {booking.student.user.name?.[0].toUpperCase() || "S"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{booking.student.user.name}</h3>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.time} ({booking.duration}m)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            <Badge variant="secondary" className="bg-accent/5 text-accent font-bold px-3 py-1 mr-2 tracking-wide uppercase text-[10px]">
                                                LKR {booking.amount}
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                                onClick={() => handleAction(booking.id, 'rejected')}
                                            >
                                                <X className="w-4 h-4 mr-1" /> Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="rounded-xl shadow-lg shadow-accent/20"
                                                onClick={() => handleAction(booking.id, 'confirmed')}
                                            >
                                                <Check className="w-4 h-4 mr-1" /> Accept
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-accent/5 rounded-3xl border border-dashed border-border">
                                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                                            <AlertCircle className="w-8 h-8 text-muted-foreground opacity-30" />
                                        </div>
                                        <h3 className="font-bold text-lg text-foreground/70">No Pending Requests</h3>
                                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">When students book a session with you, they will appear here for your approval.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Booking History</CardTitle>
                            <CardDescription>Past and confirmed bookings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] pr-4">
                                <div className="space-y-3">
                                    {historyBookings.length > 0 ? historyBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/20 hover:bg-card/40 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 border border-border">
                                                    <AvatarImage src={booking.student.user.image || ""} />
                                                    <AvatarFallback className="text-xs">{booking.student.user.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="font-bold text-sm tracking-tight">{booking.student.user.name}</h4>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {format(new Date(booking.date), 'MMM dd')} • {booking.time} • LKR {booking.amount}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No booking history yet.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
