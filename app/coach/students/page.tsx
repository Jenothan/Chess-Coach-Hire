'use client';

import { useState, useEffect } from 'react';
import { getCoachStudents } from '@/lib/actions/coachActions';
import { Users, Clock, Calendar, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoachStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    useEffect(() => {
        async function loadData() {
            const coachId = localStorage.getItem('coachId'); // Assuming coachId is stored
            if (!coachId) {
                // Try to get it from profile if not in localStorage
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const { getProfileData } = await import('@/lib/actions/userActions');
                    const profile = await getProfileData(userId);
                    if (profile.success && profile.data?.coachProfile) {
                        const cid = profile.data.coachProfile.id;
                        const result = await getCoachStudents(cid);
                        if (result.success) setStudents(result.data || []);
                    }
                }
            } else {
                const result = await getCoachStudents(coachId);
                if (result.success) {
                    setStudents(result.data || []);
                }
            }
            setLoading(false);
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Students</h1>
                <p className="text-muted-foreground mt-2">Manage and view coaching history for all your students.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Students List */}
                <div className="lg:col-span-1 space-y-4">
                    {students.length === 0 ? (
                        <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                            <p className="text-muted-foreground font-medium">No students found yet.</p>
                        </div>
                    ) : (
                        students.map((student) => (
                            <Card
                                key={student.id}
                                className={`cursor-pointer transition-all hover:shadow-md border-border/50 overflow-hidden ${selectedStudent?.id === student.id ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-accent/5'}`}
                                onClick={() => setSelectedStudent(student)}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border border-border">
                                        <AvatarFallback className="bg-accent/10 text-accent font-bold">
                                            {student.name?.charAt(0) || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{student.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-accent">{student.totalHours.toFixed(1)}h</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{student.lessonsCount} Lessons</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Student Details / History */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="border-b border-border/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-16 h-16 border-2 border-accent/20">
                                                <AvatarFallback className="bg-accent/10 text-accent text-xl font-bold">
                                                    {selectedStudent.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                                                <CardDescription>{selectedStudent.email}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-accent/10 px-4 py-2 rounded-xl text-center">
                                                <p className="text-xs font-bold text-accent uppercase tracking-tighter">Total Hours</p>
                                                <p className="text-xl font-black">{selectedStudent.totalHours.toFixed(1)}</p>
                                            </div>
                                            <div className="bg-accent/5 px-4 py-2 rounded-xl text-center">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Lessons</p>
                                                <p className="text-xl font-black">{selectedStudent.lessonsCount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-accent" />
                                            Lesson History
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedStudent.history.map((lesson: any) => (
                                                <div key={lesson.id} className="flex items-center justify-between p-4 bg-accent/5 border border-border/50 rounded-xl hover:bg-accent/10 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-card rounded-lg border border-border">
                                                            <Calendar className="w-5 h-5 text-accent" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold">{new Date(lesson.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.time}</span>
                                                                <span>•</span>
                                                                <span>{lesson.duration} mins</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-emerald-500">LKR {lesson.amount}</p>
                                                        <Badge variant="outline" className="text-[10px] capitalize bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Completed</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-card/30 border border-dashed border-border rounded-3xl p-12 text-center">
                            <div className="p-4 bg-accent/5 rounded-full mb-4">
                                <Users className="w-12 h-12 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold">Select a Student</h3>
                            <p className="text-muted-foreground max-w-xs mt-2 text-sm leading-relaxed">
                                Click on a student from the list to view their detailed coaching history and performance metrics.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
