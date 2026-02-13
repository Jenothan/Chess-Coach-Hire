import { Link } from 'react-router';
import { Crown, Users, Calendar, Star, TrendingUp, Shield, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';

export function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-accent" />
              <span className="text-2xl font-bold">ChessCoach</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="accent">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
            World's Leading Chess Coaching Platform
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Chess with Expert Coaches Worldwide
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-8">
            Connect with professional chess coaches, book personalized lessons, and improve your game with flexible scheduling and competitive pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=student">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Find a Coach
              </Button>
            </Link>
            <Link to="/register?role=coach">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Become a Coach
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              <span>500+ Expert Coaches</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              <span>10,000+ Happy Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>50,000+ Lessons Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20 bg-card/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose ChessCoach?</h2>
          <p className="text-lg text-muted-foreground">Everything you need to excel in chess</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: 'Expert Coaches',
              description: 'Learn from FIDE-rated masters and grandmasters with proven track records'
            },
            {
              icon: Calendar,
              title: 'Flexible Scheduling',
              description: 'Book lessons at your convenience with easy-to-use calendar system'
            },
            {
              icon: TrendingUp,
              title: 'Track Progress',
              description: 'Monitor your improvement with detailed analytics and feedback'
            },
            {
              icon: Shield,
              title: 'Secure Payments',
              description: 'Safe and secure payment processing with multiple payment options'
            },
            {
              icon: Star,
              title: 'Rating System',
              description: 'Transparent reviews and ratings to help you choose the right coach'
            },
            {
              icon: Crown,
              title: 'Premium Quality',
              description: 'Verified coaches with certificates and extensive experience'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
            >
              <feature.icon className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Create Account',
              description: 'Sign up as a student or coach in minutes with our simple registration'
            },
            {
              step: '2',
              title: 'Browse & Book',
              description: 'Search for coaches by rating, price, and availability, then book your lesson'
            },
            {
              step: '3',
              title: 'Learn & Grow',
              description: 'Attend your lessons, track progress, and improve your chess skills'
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-8 py-20 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Elevate Your Chess Game?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students learning from the best coaches worldwide
          </p>
          <Link to="/register">
            <Button variant="accent" size="lg">
              Start Learning Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 lg:px-8 py-12 mt-20 border-t border-border">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold">ChessCoach</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting chess enthusiasts with expert coaches worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/student/coaches" className="hover:text-accent">Find Coaches</Link></li>
              <li><Link to="/register?role=student" className="hover:text-accent">Sign Up</Link></li>
              <li><Link to="/help" className="hover:text-accent">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Coaches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/register?role=coach" className="hover:text-accent">Become a Coach</Link></li>
              <li><Link to="/help" className="hover:text-accent">Coach Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-accent">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2026 ChessCoach. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
