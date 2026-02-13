import { useState } from 'react';
import { Link } from 'react-router';
import { Star, MapPin, DollarSign, Calendar, Search, Filter, Crown } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const coaches = [
  {
    id: 1,
    name: 'GM Alexander Petrov',
    title: 'Grandmaster',
    rating: 2650,
    stars: 4.9,
    reviews: 127,
    location: 'Russia',
    languages: ['English', 'Russian'],
    hourlyRate: 50,
    monthlyRate: 400,
    specialties: ['Opening Theory', 'Tactics', 'Tournament Prep'],
    experience: '15+ years',
    students: 89,
    availability: 'Available',
  },
  {
    id: 2,
    name: 'IM Maria Silva',
    title: 'International Master',
    rating: 2450,
    stars: 4.8,
    reviews: 98,
    location: 'Brazil',
    languages: ['English', 'Portuguese', 'Spanish'],
    hourlyRate: 45,
    monthlyRate: 360,
    specialties: ['Endgame', 'Strategy', 'Positional Play'],
    experience: '10+ years',
    students: 72,
    availability: 'Available',
  },
  {
    id: 3,
    name: 'FM John Smith',
    title: 'FIDE Master',
    rating: 2350,
    stars: 4.7,
    reviews: 84,
    location: 'USA',
    languages: ['English'],
    hourlyRate: 40,
    monthlyRate: 320,
    specialties: ['Tactics', 'Beginner Friendly', 'Junior Training'],
    experience: '8+ years',
    students: 65,
    availability: 'Available',
  },
  {
    id: 4,
    name: 'WGM Elena Ivanova',
    title: 'Woman Grandmaster',
    rating: 2480,
    stars: 5.0,
    reviews: 112,
    location: 'Ukraine',
    languages: ['English', 'Russian', 'Ukrainian'],
    hourlyRate: 48,
    monthlyRate: 380,
    specialties: ['Opening Prep', 'Game Analysis', 'Tournament Play'],
    experience: '12+ years',
    students: 78,
    availability: 'Limited',
  },
  {
    id: 5,
    name: 'CM David Chen',
    title: 'Candidate Master',
    rating: 2200,
    stars: 4.6,
    reviews: 56,
    location: 'China',
    languages: ['English', 'Mandarin'],
    hourlyRate: 35,
    monthlyRate: 280,
    specialties: ['Beginner', 'Intermediate', 'Online Training'],
    experience: '5+ years',
    students: 48,
    availability: 'Available',
  },
  {
    id: 6,
    name: 'GM Raj Patel',
    title: 'Grandmaster',
    rating: 2580,
    stars: 4.9,
    reviews: 145,
    location: 'India',
    languages: ['English', 'Hindi'],
    hourlyRate: 52,
    monthlyRate: 420,
    specialties: ['Attack', 'Calculation', 'Blitz Training'],
    experience: '18+ years',
    students: 95,
    availability: 'Available',
  },
];

export function CoachListingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coach.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRating = selectedRating === 'all' || 
                         (selectedRating === '2500+' && coach.rating >= 2500) ||
                         (selectedRating === '2300-2500' && coach.rating >= 2300 && coach.rating < 2500) ||
                         (selectedRating === '2000-2300' && coach.rating >= 2000 && coach.rating < 2300);
    
    const matchesPrice = selectedPrice === 'all' ||
                        (selectedPrice === '30-40' && coach.hourlyRate >= 30 && coach.hourlyRate <= 40) ||
                        (selectedPrice === '40-50' && coach.hourlyRate > 40 && coach.hourlyRate <= 50) ||
                        (selectedPrice === '50+' && coach.hourlyRate > 50);
    
    return matchesSearch && matchesRating && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Find Your Perfect Coach</h1>
        <p className="text-muted-foreground">Browse our expert chess coaches and book your lesson</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-sm mb-2">Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
                  >
                    <option value="all">All Ratings</option>
                    <option value="2500+">2500+ (GM)</option>
                    <option value="2300-2500">2300-2500 (IM/FM)</option>
                    <option value="2000-2300">2000-2300 (CM/NM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Price per Hour</label>
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg"
                  >
                    <option value="all">All Prices</option>
                    <option value="30-40">$30 - $40</option>
                    <option value="40-50">$40 - $50</option>
                    <option value="50+">$50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Availability</label>
                  <select className="w-full px-3 py-2 bg-input-background border border-border rounded-lg">
                    <option value="all">All</option>
                    <option value="available">Available Now</option>
                    <option value="limited">Limited Slots</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Found {filteredCoaches.length} coaches
        </p>
        <select className="px-3 py-2 bg-input-background border border-border rounded-lg text-sm">
          <option>Sort by: Recommended</option>
          <option>Highest Rating</option>
          <option>Lowest Price</option>
          <option>Most Reviews</option>
        </select>
      </div>

      {/* Coach Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCoaches.map((coach) => (
          <Card key={coach.id} className="hover:border-accent transition-colors">
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Coach Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-3xl">
                    {coach.name[0]}
                  </div>
                </div>

                {/* Coach Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{coach.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{coach.title}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3 text-accent" />
                          {coach.rating}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      coach.availability === 'Available' 
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-yellow-500/10 text-yellow-600'
                    }`}>
                      {coach.availability}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{coach.stars}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({coach.reviews} reviews)
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {coach.students} students
                    </span>
                  </div>

                  {/* Location & Languages */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {coach.location}
                    </span>
                    <span>{coach.languages.join(', ')}</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Pricing & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hourly</p>
                        <p className="font-bold text-lg">${coach.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="font-bold text-lg">${coach.monthlyRate}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/student/coaches/${coach.id}`}>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </Link>
                      <Link to={`/student/booking/${coach.id}`}>
                        <Button variant="accent" size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
