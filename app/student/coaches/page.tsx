'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Star, MapPin, Clock, Trophy } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Mock data for coaches
const coaches = [
    {
        id: 1,
        name: 'Grandmaster Alex',
        title: 'Grandmaster (GM)',
        rating: 2800,
        hourlyRate: 80,
        specialty: 'Advanced Strategy',
        bio: 'Former national champion with 15 years of coaching experience. I specialize in helps advanced players reach master level.',
        imageUrl: '/placeholder-user.jpg',
        availability: 'Available Today',
        languages: ['English', 'Russian'],
    },
    {
        id: 2,
        name: 'Sarah Jones',
        title: 'International Master (IM)',
        rating: 2450,
        hourlyRate: 50,
        specialty: 'Tactics & Openings',
        bio: 'Passionate about teaching juniors and intermediate players. My students have won multiple state championships.',
        imageUrl: '/placeholder-user-2.jpg',
        availability: 'Available Tomorrow',
        languages: ['English', 'Spanish'],
    },
    {
        id: 3,
        name: 'David Chen',
        title: 'FIDE Master (FM)',
        rating: 2320,
        hourlyRate: 35,
        specialty: 'Endgame Theory',
        bio: 'Endgame specialist. I believe the endgame is where the game is truly won. Let\'s master the fundamentals together.',
        imageUrl: '/placeholder-user-3.jpg',
        availability: 'Available Today',
        languages: ['English', 'Mandarin'],
    },
    {
        id: 4,
        name: 'Elena Petrova',
        title: 'Woman Grandmaster (WGM)',
        rating: 2410,
        hourlyRate: 60,
        specialty: 'Attacking Chess',
        bio: 'Aggressive player and coach. I teach how to create complications and navigate chaotic positions with confidence.',
        imageUrl: '/placeholder-user-4.jpg',
        availability: 'Next Week',
        languages: ['English', 'Russian', 'German'],
    },
    {
        id: 5,
        name: 'Mark Wilson',
        title: 'Candidate Master (CM)',
        rating: 2150,
        hourlyRate: 25,
        specialty: 'Beginner Foundations',
        bio: 'Great with kids and absolute beginners. I make learning chess fun and accessible for everyone.',
        imageUrl: '/placeholder-user-5.jpg',
        availability: 'Available Today',
        languages: ['English'],
    },
    {
        id: 6,
        name: 'Jessica Lee',
        title: 'National Master (NM)',
        rating: 2250,
        hourlyRate: 40,
        specialty: 'Positional Play',
        bio: 'Focus on solid foundations and long-term planning. Learn to think like a master.',
        imageUrl: '/placeholder-user-6.jpg',
        availability: 'Available Tomorrow',
        languages: ['English', 'Korean'],
    }
];

export default function FindCoachesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');

    const filteredCoaches = coaches.filter(coach => {
        const matchesSearch = coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'all' || coach.specialty.includes(specialtyFilter); // Simplified matching

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
                        <div className="w-full md:w-[200px]">
                            <Select>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Price Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Prices</SelectItem>
                                    <SelectItem value="low">Under $30</SelectItem>
                                    <SelectItem value="mid">$30 - $60</SelectItem>
                                    <SelectItem value="high">$60+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoaches.map((coach) => (
                    <Card key={coach.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                        <div className="h-2 bg-primary/80" />
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-background">
                                        <AvatarImage src={coach.imageUrl} alt={coach.name} />
                                        <AvatarFallback>{coach.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                                {coach.languages.map(lang => (
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
        </div>
    );
}
