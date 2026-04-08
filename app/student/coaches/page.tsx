'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Star, Clock, Trophy } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getAllCoaches } from '@/lib/actions/coachActions';

export default function FindCoachesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [coaches, setCoaches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // This effect runs when the page loads
    useEffect(() => {
        async function fetchCoaches() {
            setLoading(true);
            // We call our new Server Action to get data from the database
            const result = await getAllCoaches();
            if (result.success && result.data) {
                // We format the database data to match what the UI expects
                const formattedCoaches = result.data.map((c: any) => ({
                    id: c.id,
                    name: c.user.name || 'Anonymous',
                    title: c.title,
                    rating: c.rating,
                    hourlyRate: c.hourlyRate,
                    specialty: c.specialties[0] || 'General',
                    bio: c.bio || 'No bio available.',
                    imageUrl: c.avatar || '/placeholder-user.jpg',
                    availability: c.availability,
                    languages: c.languages,
                }));
                setCoaches(formattedCoaches);
            }
            setLoading(false);
        }
        fetchCoaches();
    }, []);

    // Filter the coaches based on search text and specialty dropdown
    const filteredCoaches = coaches.filter(coach => {
        const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'all' || coach.specialty.includes(specialtyFilter);

        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Find Your Perfect Coach</h1>
                    <p className="text-muted-foreground mt-1">Browse our roster of titled players and experienced coaches.</p>
                </div>

                <Card className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, title, or keyword..."
                                className="pl-9 h-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Specialties</SelectItem>
                                    <SelectItem value="Strategy">Strategy</SelectItem>
                                    <SelectItem value="Tactics">Tactics</SelectItem>
                                    <SelectItem value="Openings">Openings</SelectItem>
                                    <SelectItem value="Endgame">Endgames</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>
            </div>

            {loading ? (
                // Show a loading message while we wait for the database
                <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground animate-pulse">Loading coaches from database...</p>
                </div>
            ) : filteredCoaches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoaches.map((coach) => (
                        <Card key={coach.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                            <div className="h-2 bg-primary/80" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background">
                                            <AvatarImage src={coach.imageUrl} alt={coach.name} />
                                            <AvatarFallback>{coach.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{coach.name}</CardTitle>
                                            <p className="text-sm text-primary font-medium">{coach.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="ml-1 text-sm font-bold text-foreground">{coach.rating}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-4">
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {coach.bio}
                                </p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm">
                                        <Trophy className="w-4 h-4 mr-2 text-primary" />
                                        <span className="text-muted-foreground">Specialty: </span>
                                        <span className="ml-1 font-medium">{coach.specialty}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Clock className="w-4 h-4 mr-2 text-primary" />
                                        <span className={coach.availability === 'Available Today' ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                                            {coach.availability}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {coach.languages.map((lang: string) => (
                                        <Badge key={lang} variant="secondary" className="text-xs bg-muted/50 font-normal">
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t bg-muted/20 flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-bold">${coach.hourlyRate}</span>
                                    <span className="text-sm text-muted-foreground">/hr</span>
                                </div>
                                <Button>Book Lesson</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                // Show this if no coaches are found
                <div className="text-center py-20 bg-card border border-dashed rounded-lg">
                    <p className="text-xl text-muted-foreground">No coaches found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
