'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Star, Trophy, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { format, isSameDay, parseISO, addHours } from 'date-fns';
import { getCoachBookingAvailability, createBooking } from '@/lib/actions/coachActions';
import { getProfileData } from '@/lib/actions/userActions';
import { toast } from "sonner";
import Link from 'next/link';

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const coachId = params.coachId as string;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [studentProfileId, setStudentProfileId] = useState<string>('');

    useEffect(() => {
        async function init() {
            setLoading(true);

            // 1. Get coach availability
            const result = await getCoachBookingAvailability(coachId);
            if (result.success) {
                setData(result.data);
            } else {
                toast.error("Failed to load coach details");
                router.push('/student/coaches');
            }

            // 2. Get student profile id
            const userId = localStorage.getItem('userId');
            if (userId) {
                const profileResult = await getProfileData(userId);
                if (profileResult.success && profileResult.data && profileResult.data.studentProfile) {
                    setStudentProfileId(profileResult.data.studentProfile.id);
                }
            }

            setLoading(false);
        }
        init();
    }, [coachId]);

    // Calculate available slots for a specific date
    const getAvailableSlots = (date: Date) => {
        if (!data) return [];

        const dayOfWeek = format(date, 'EEEE');
        const weeklySlots = data.slots.filter((s: any) => s.day === dayOfWeek && !s.isBusy);

        const confirmedBookings = data.bookings.filter((b: any) =>
            isSameDay(new Date(b.date), date)
        );

        return weeklySlots.map((slot: any) => {
            const isTaken = confirmedBookings.some((b: any) => b.time === slot.startTime);
            return {
                ...slot,
                isTaken
            };
        });
    };

    // Determine if a date is "Busy" (all slots taken) or "Unavailable" (no slots)
    const getDateStatus = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return 'disabled';

        const slots = getAvailableSlots(date);
        if (slots.length === 0) return 'unavailable';
        if (slots.every((s: any) => s.isTaken)) return 'busy';
        return 'available';
    };

    const computeAmount = (slot: any) => {
        if (!slot || !data) return 0;
        const [startH, startM] = slot.startTime.split(':').map(Number);
        const [endH, endM] = slot.endTime.split(':').map(Number);
        let durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        if (durationMinutes < 0) durationMinutes += 24 * 60;
        return Math.floor((durationMinutes / 60) * data.coach.hourlyRate);
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedSlot || !studentProfileId) return;

        setSubmitting(true);

        // Calculate amount
        const startTime = selectedSlot.startTime;
        const endTime = selectedSlot.endTime;
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        const duration = (endH * 60 + endM) - (startH * 60 + startM);
        const amount = Math.floor((duration / 60) * data.coach.hourlyRate);

        const result = await createBooking({
            studentId: studentProfileId,
            coachId: coachId,
            date: selectedDate,
            time: selectedSlot.startTime,
            duration: duration,
            amount: amount
        });

        if (result.success) {
            toast.success("Booking request sent successfully!");
            router.push('/student/bookings');
        } else {
            toast.error(result.error || "Failed to create booking");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
                <p className="text-muted-foreground animate-pulse">Checking coach availability...</p>
            </div>
        );
    }

    const currentSlots = selectedDate ? getAvailableSlots(selectedDate) : [];
    const unavailableInCalendar = (date: Date) => {
        const status = getDateStatus(date);
        return status === 'unavailable' || status === 'disabled' || status === 'busy';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/student/coaches">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Coaches
                    </Button>
                </Link>
                <Badge variant="outline" className="text-accent border-accent/30 bg-accent/5">Step 1: Select Date & Time</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coach Info Card */}
                <Card className="lg:col-span-1 h-fit overflow-hidden glass-card shadow-premium group">
                    <CardHeader className="relative pt-8 text-center pb-2">
                        <Avatar className="h-28 w-28 mx-auto border-4 border-background shadow-xl ring-2 ring-foreground/5 transition-transform duration-500 group-hover:scale-105">
                            <AvatarImage src={data.coach.avatar || "/placeholder-user.jpg"} />
                            <AvatarFallback className="text-2xl font-bold bg-accent/20 text-accent">{data.coach.name[0]}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl mt-4 font-bold">{data.coach.name}</CardTitle>
                        <CardDescription className="text-accent font-medium text-lg">{data.coach.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-0">
                        <div className="flex justify-center items-center gap-2 text-yellow-500">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(data.coach.stars) ? 'fill-current' : 'text-muted-foreground/30'}`} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-foreground">{data.coach.stars.toFixed(1)}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors">
                                <span className="text-sm font-medium text-muted-foreground">Hourly Rate</span>
                                <span className="font-bold text-xl text-foreground">LKR {data.coach.hourlyRate}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-foreground/5">
                                <span className="text-sm font-medium text-muted-foreground">Waitlist</span>
                                <span className="text-sm font-bold">~24 Hours</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Specialties</p>
                            <div className="flex flex-wrap gap-2">
                                {data.coach.specialties.map((s: string) => (
                                    <Badge key={s} variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 border-none transition-colors px-3 py-1">{s}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selection Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Calendar Card */}
                        <Card className="glass-card shadow-premium border-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-accent" /> Select Lesson Date
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(d) => {
                                        setSelectedDate(d);
                                        setSelectedSlot(null);
                                    }}
                                    className="rounded-xl border-none p-0 mx-auto"
                                    disabled={unavailableInCalendar}
                                    modifiers={{
                                        busy: (date) => getDateStatus(date) === 'busy',
                                        hasSlots: (date) => getDateStatus(date) === 'available'
                                    }}
                                    modifiersClassNames={{
                                        busy: "after:content-['•'] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:text-orange-500 opacity-50",
                                        hasSlots: "bg-accent/10 font-bold"
                                    }}
                                />
                                <div className="mt-4 flex gap-4 text-xs text-muted-foreground justify-center">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-accent" /> Available
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-orange-500" /> Fully Booked
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Slots Card */}
                        <Card className="glass-card shadow-premium border-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-accent" /> Available Slots
                                </CardTitle>
                                <CardDescription>
                                    {selectedDate ? format(selectedDate, 'EEEE, MMMM do') : 'Please select a date'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px] pr-4">
                                    <div className="space-y-3">
                                        {currentSlots.length > 0 ? currentSlots.map((slot: any) => (
                                            <button
                                                key={slot.id}
                                                disabled={slot.isTaken}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${slot.isTaken
                                                    ? 'bg-muted/10 border-transparent opacity-40 cursor-not-allowed'
                                                    : selectedSlot?.id === slot.id
                                                        ? 'bg-accent border-accent text-white shadow-lg shadow-accent/40 scale-[1.02]'
                                                        : 'bg-foreground/5 border-transparent hover:border-accent/40 hover:bg-accent/5'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-2 w-2 rounded-full ${slot.isTaken ? 'bg-muted-foreground' : 'bg-accent shadow-[0_0_8px_rgba(255,107,0,0.8)]'}`} />
                                                    <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                                                </div>
                                                <Badge variant={slot.isTaken ? "secondary" : "outline"} className={slot.isTaken ? "" : "border-accent/30 text-accent"}>
                                                    {slot.isTaken ? 'Taken' : 'Available'}
                                                </Badge>
                                            </button>
                                        )) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Clock className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                                <p className="text-sm">No slots on this day</p>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Booking Footer */}
                    <Card className="border-none bg-gradient-to-r from-accent/5 to-transparent backdrop-blur-xl shadow-premium rounded-3xl overflow-hidden">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${selectedSlot ? 'bg-accent shadow-lg shadow-accent/40' : 'bg-foreground/10'}`}>
                                    <CheckCircle2 className={`w-7 h-7 ${selectedSlot ? 'text-white' : 'text-muted-foreground/30'}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Booking Summary</p>
                                    <h4 className="font-bold text-lg">
                                        {selectedSlot
                                            ? `${format(selectedDate!, 'MMM d')} at ${selectedSlot.startTime}`
                                            : "Select a slot to continue"}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto">
                                {selectedSlot && (
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Price</p>
                                        <p className="text-xl font-black">LKR {computeAmount(selectedSlot)}</p>
                                        <p className="text-[10px] text-accent font-medium mt-1 animate-pulse">Confirming availability...</p>
                                    </div>
                                )}
                                <Button
                                    size="lg"
                                    className="w-full md:w-auto min-w-[200px] h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 font-bold text-lg transition-all active:scale-95 group relative overflow-hidden"
                                    disabled={!selectedSlot || submitting}
                                    onClick={handleBooking}
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Booking"}
                                    </span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
