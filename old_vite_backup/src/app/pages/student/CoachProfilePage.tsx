import { useParams, Link } from 'react-router';
import { Star, MapPin, Crown, Calendar, Clock, Award, Users, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mock data - in real app, this would come from API
const coach = {
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
  specialties: ['Opening Theory', 'Tactics', 'Tournament Prep', 'Endgame'],
  experience: '15+ years',
  students: 89,
  bio: 'Experienced grandmaster with over 15 years of teaching experience. I specialize in helping players break through plateaus and develop a deeper understanding of chess principles. My students have won numerous tournaments and achieved significant rating improvements.',
  achievements: [
    'FIDE Grandmaster Title (2010)',
    'Russian Championship Finalist (2015)',
    'Coached 5 players to IM title',
    'Author of "Modern Chess Openings"',
  ],
  availability: ['Mon, Wed, Fri: 9 AM - 6 PM', 'Tue, Thu: 2 PM - 8 PM', 'Sat: 10 AM - 4 PM'],
};

const reviews = [
  { id: 1, student: 'David L.', rating: 5, date: '2026-02-08', comment: 'Excellent coach! Helped me improve my opening repertoire significantly. Very patient and knowledgeable.' },
  { id: 2, student: 'Emma W.', rating: 5, date: '2026-02-05', comment: 'GM Petrov is an outstanding teacher. His explanations are clear and he provides great homework assignments.' },
  { id: 3, student: 'Michael B.', rating: 5, date: '2026-02-01', comment: 'Best chess coach I\'ve ever had. Highly recommend for intermediate to advanced players.' },
  { id: 4, student: 'Sophie C.', rating: 4, date: '2026-01-28', comment: 'Very good coach, though sometimes the lessons can be quite intensive. Great for serious learners!' },
];

export function CoachProfilePage() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/student/coaches">
        <Button variant="ghost" size="sm">
          ← Back to Coaches
        </Button>
      </Link>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center text-5xl">
                {coach.name[0]}
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="mb-2">{coach.name}</h1>
                  <div className="flex items-center gap-3 text-muted-foreground mb-2">
                    <span>{coach.title}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Crown className="w-4 h-4 text-accent" />
                      {coach.rating}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {coach.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{coach.stars}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({coach.reviews} reviews)
                    </span>
                    <span className="text-muted-foreground">
                      • {coach.students} students
                    </span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-accent/5 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Single Lesson</p>
                      <p className="text-2xl font-bold">${coach.hourlyRate}/hr</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Plan</p>
                      <p className="text-2xl font-bold">${coach.monthlyRate}/mo</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Languages:</p>
                <div className="flex gap-2">
                  {coach.languages.map((lang, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link to={`/student/booking/${coach.id}`} className="flex-1 md:flex-initial">
                  <Button variant="accent" className="w-full md:w-auto">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Lesson
                  </Button>
                </Link>
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <h3>About</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{coach.bio}</p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <h3>Specialties</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {coach.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-lg"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3>Student Reviews</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{coach.stars}</span>
                  <span className="text-muted-foreground">({coach.reviews} reviews)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm">
                          {review.student[0]}
                        </div>
                        <span className="font-semibold">{review.student}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <h3>Achievements</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {coach.achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <h3>Stats</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Students
                  </span>
                  <span className="font-bold">{coach.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Experience
                  </span>
                  <span className="font-bold">{coach.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Reviews
                  </span>
                  <span className="font-bold">{coach.reviews}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <h3>Typical Availability</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coach.availability.map((schedule, idx) => (
                  <div key={idx} className="text-sm p-2 bg-accent/5 rounded">
                    {schedule}
                  </div>
                ))}
              </div>
              <Link to={`/student/booking/${coach.id}`}>
                <Button variant="outline" className="w-full mt-4">
                  View Full Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
