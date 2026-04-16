'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Clock, Video, User, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { getCoachDashboardData, addSlot, removeSlot, toggleSlotBusy } from '@/lib/actions/coachActions';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [newSlot, setNewSlot] = useState({
        day: format(new Date(), 'EEEE'),
        startTime: '09:00',
        endTime: '10:00'
    });

    const [coachId, setCoachId] = useState<string>('');

    useEffect(() => {
        const storedCoachId = localStorage.getItem('coachId');
        const storedUserId = localStorage.getItem('userId');

        if (storedCoachId) {
            setCoachId(storedCoachId);
        } else if (storedUserId) {
            setCoachId(storedUserId);
        }
    }, []);

    const fetchData = async () => {
        if (!coachId) return;
        setLoading(true);
        const result = await getCoachDashboardData(coachId);
        if (result.success) {
            setData(result.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [coachId]);

    const handleAddSlot = async () => {
        if (!coachId) return;
        const result = await addSlot(coachId, newSlot);
        if (result.success) {
            toast.success("Slot added successfully");
            setIsAddDialogOpen(false);
            fetchData();
        } else {
            toast.error("Failed to add slot");
        }
    };

    const handleToggleBusy = async (slotId: string, currentBusy: boolean) => {
        const result = await toggleSlotBusy(slotId, !currentBusy);
        if (result.success) {
            toast.success(`Slot marked as ${!currentBusy ? 'Busy' : 'Free'}`);
            fetchData();
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        const result = await removeSlot(slotId);
        if (result.success) {
            toast.success("Slot removed");
            fetchData();
        }
    };

    if (loading && !data) {
        return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    const { upcomingLessons, slots } = data || { upcomingLessons: [], slots: [] };

    const calculateSlotAmount = (startTime: string, endTime: string) => {
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        let durationMinutes = endMinutes - startMinutes;
        if (durationMinutes < 0) durationMinutes += 24 * 60;
        const hourlyRate = data?.hourlyRate || 0;
        return Math.floor((durationMinutes / 60) * hourlyRate);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage your availability and upcoming sessions.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="accent">
                                <Plus className="mr-2 h-4 w-4" /> Add Slot
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Availability Slot</DialogTitle>
                                <DialogDescription>Create a new time slot when you are available for lessons.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="day" className="text-right">Day</Label>
                                    <Select
                                        value={newSlot.day}
                                        onValueChange={(v) => setNewSlot({ ...newSlot, day: v })}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="start" className="text-right">Start Time</Label>
                                    <Input
                                        id="start"
                                        type="time"
                                        className="col-span-3"
                                        value={newSlot.startTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="end" className="text-right">End Time</Label>
                                    <Input
                                        id="end"
                                        type="time"
                                        className="col-span-3"
                                        value={newSlot.endTime}
                                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <div className="col-start-2 col-span-3 text-sm text-accent font-medium">
                                        Estimated Earning: LKR {calculateSlotAmount(newSlot.startTime, newSlot.endTime)}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddSlot}>Save Slot</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader><CardTitle>Calendar</CardTitle></CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow" />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Session Requests</CardTitle>
                        <CardDescription>Upcoming confirmed lessons.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {upcomingLessons.length > 0 ? upcomingLessons.map((session: any) => (
                                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                {session.time.split(':')[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{session.time} - {session.duration} min</h3>
                                                <div className="flex items-center text-muted-foreground text-sm gap-2">
                                                    <User className="w-3 h-3" /> {session.student.user.name}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-500/15 text-green-700 border-0">{session.status}</Badge>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No upcoming sessions.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Availability Slots</CardTitle>
                    <CardDescription>Manage your weekly slots. Students can book your available time slots.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {slots.length > 0 ? (
                            slots.map((slot: any) => (
                                <div key={slot.id} className={`p-4 border rounded-lg transition-all ${slot.isBusy ? 'bg-muted/50 border-muted-foreground/30 opacity-60' : 'bg-card border-accent/20 hover:border-accent'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="font-bold text-lg">{slot.day}</div>
                                        <Button variant="ghost" size="icon-xs" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteSlot(slot.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {slot.startTime} - {slot.endTime}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Badge variant={slot.isBusy ? "secondary" : "accent"} className="cursor-pointer" onClick={() => handleToggleBusy(slot.id, slot.isBusy)}>
                                            {slot.isBusy ? 'Busy' : `LKR ${calculateSlotAmount(slot.startTime, slot.endTime)}`}
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                                No slots added yet. Click "Add Slot" to start.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
