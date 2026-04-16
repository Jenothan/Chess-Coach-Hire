'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Mail } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCoachesData, updateCoachStatus } from '@/lib/actions/adminActions';

export default function CoachesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [coaches, setCoaches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCoaches = async () => {
        try {
            const data = await getCoachesData();
            setCoaches(data);
        } catch (error) {
            console.error("Error fetching coaches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoaches();
    }, []);

    const handleStatusUpdate = async (coachId: string, status: string) => {
        const result = await updateCoachStatus(coachId, status);
        if (result.success) {
            fetchCoaches();
        }
    };

    const filteredCoaches = coaches.filter(coach =>
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE': return 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25/15';
            case 'PENDING': return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/25';
            case 'SUSPENDED': return 'bg-red-500/15 text-red-700 dark:text-red-400 hover:bg-red-500/25';
            case 'REJECTED': return 'bg-gray-500/15 text-gray-700 dark:text-gray-400';
            default: return 'bg-gray-500/15 text-gray-700 dark:text-gray-400';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading coaches...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coaches Management</h1>
                    <p className="text-muted-foreground mt-1">Manage platform coaches, approvals, and status.</p>
                </div>
                <Button>
                    <Mail className="mr-2 h-4 w-4" /> Invite Coach
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Coaches</CardTitle>
                    <CardDescription>
                        A list of all registered coaches on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search coaches..."
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCoaches.length > 0 ? (
                                    filteredCoaches.map((coach) => (
                                        <TableRow key={coach.id}>
                                            <TableCell className="font-medium">
                                                <div>{coach.name}</div>
                                                <div className="text-xs text-muted-foreground">{coach.email}</div>
                                            </TableCell>
                                            <TableCell>{coach.specialty}</TableCell>
                                            <TableCell>{coach.rating}</TableCell>
                                            <TableCell>{coach.students}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={getStatusColor(coach.status)}>
                                                    {coach.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{coach.joinedDate}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View details</DropdownMenuItem>
                                                        <DropdownMenuItem>View students</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {coach.status.toUpperCase() === 'PENDING' && (
                                                            <DropdownMenuItem className="text-green-600" onClick={() => handleStatusUpdate(coach.id, 'ACTIVE')}>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                        {coach.status.toUpperCase() !== 'SUSPENDED' ? (
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleStatusUpdate(coach.id, 'SUSPENDED')}>
                                                                <XCircle className="mr-2 h-4 w-4" /> Suspend
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem className="text-green-600" onClick={() => handleStatusUpdate(coach.id, 'ACTIVE')}>
                                                                <CheckCircle className="mr-2 h-4 w-4" /> Reactivate
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No coaches found.
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
