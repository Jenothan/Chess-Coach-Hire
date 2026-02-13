'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Clock, Video, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for upcoming sessions
const upcomingSessions = [
    {
        id: 1,
        student: 'John Smith',
        time: '10:00 AM',
        date: new Date(),
        type: 'Opening Theory',
        status: 'Confirmed',
    },
    {
        id: 2,
        student: 'Emily Davis',
        time: '2:30 PM',
        date: new Date(),
        type: 'Endgame Practice',
        status: 'Pending',
    },
    {
        id: 3,
        student: 'Michael Wilson',
        time: '11:00 AM',
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        type: 'Game Review',
        status: 'Confirmed',
    }
];

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage your availability and upcoming sessions.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Sync Calendar</Button>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Slot
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border shadow"
                        />
                    </CardContent>
                </Card>

                {/* Day's Schedule */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Sessions for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}</CardTitle>
                        <CardDescription>You have {upcomingSessions.filter(s => date && s.date.getDate() === date.getDate()).length} sessions scheduled for this day.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {upcomingSessions
                                    .filter(session => !date || session.date.getDate() === date.getDate())
                                    .map((session) => (
                                        <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                    {session.time.split(':')[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{session.time} - {session.type}</h3>
                                                    <div className="flex items-center text-muted-foreground text-sm gap-2">
                                                        <User className="w-3 h-3" /> {session.student}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                                <Badge variant={session.status === 'Confirmed' ? 'default' : 'secondary'} className={session.status === 'Confirmed' ? 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0' : 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25 border-0'}>
                                                    {session.status}
                                                </Badge>
                                                {session.status === 'Confirmed' && (
                                                    <Button size="sm" variant="outline" className="ml-auto sm:ml-0">
                                                        <Video className="w-4 h-4 mr-2" /> Join
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                {upcomingSessions.filter(s => !date || s.date.getDate() === date.getDate()).length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No sessions scheduled for this date.</p>
                                        <Button variant="link" className="mt-2">Add availability</Button>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats or Availability Settings could go here */}
            <Card>
                <CardHeader>
                    <CardTitle>Availability Settings</CardTitle>
                    <CardDescription>Manage your weekly recurring availability.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <div key={day} className="border rounded-lg p-3 text-center hover:border-primary cursor-pointer transition-colors">
                                <div className="font-medium mb-2">{day}</div>
                                <div className="text-xs text-muted-foreground">9:00 - 17:00</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
