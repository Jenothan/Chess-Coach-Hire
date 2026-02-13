import { Search, BookOpen, MessageCircle, CreditCard, Calendar, Shield } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const faqs = [
  {
    category: 'Getting Started',
    icon: BookOpen,
    questions: [
      {
        q: 'How do I book my first lesson?',
        a: 'Browse coaches, select one that fits your needs, choose a time slot, and complete the payment. You\'ll receive a confirmation email with joining details.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. All payments are processed securely.',
      },
      {
        q: 'Can I try a coach before committing to a monthly plan?',
        a: 'Yes! We recommend starting with a single lesson to see if the coach is a good fit before purchasing a monthly plan.',
      },
    ],
  },
  {
    category: 'Bookings & Scheduling',
    icon: Calendar,
    questions: [
      {
        q: 'Can I cancel or reschedule a lesson?',
        a: 'Yes, you can cancel or reschedule up to 24 hours before the lesson starts. Cancellations within 24 hours are not eligible for refunds.',
      },
      {
        q: 'How do I join my online lesson?',
        a: 'You\'ll receive an email with a meeting link. Simply click the link at the scheduled time to join your lesson.',
      },
      {
        q: 'What happens if my coach cancels?',
        a: 'In the rare case a coach needs to cancel, you\'ll receive a full refund or the option to reschedule at no extra cost.',
      },
    ],
  },
  {
    category: 'Payments & Refunds',
    icon: CreditCard,
    questions: [
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. We use industry-standard encryption and never store your full card details on our servers.',
      },
      {
        q: 'How do refunds work?',
        a: 'Cancellations made 24+ hours before a lesson receive a full refund. Monthly plans can be cancelled anytime with unused lessons refunded.',
      },
      {
        q: 'Do coaches set their own prices?',
        a: 'Yes, coaches set their rates based on their experience and qualifications. You can filter coaches by price range.',
      },
    ],
  },
  {
    category: 'For Coaches',
    icon: Shield,
    questions: [
      {
        q: 'How do I become a coach on the platform?',
        a: 'Register as a coach, complete your profile with certifications and experience, and wait for admin approval. We typically review applications within 48 hours.',
      },
      {
        q: 'How and when do I get paid?',
        a: 'Payments are transferred to your account 24 hours after each completed lesson. You can track your earnings in the dashboard.',
      },
      {
        q: 'Can I set my own availability?',
        a: 'Yes, you have full control over your schedule. Set available time slots and students can only book during those times.',
      },
    ],
  },
];

const contactOptions = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    action: 'Start Chat',
  },
  {
    icon: BookOpen,
    title: 'Help Center',
    description: 'Browse our documentation',
    action: 'Visit Center',
  },
  {
    icon: Shield,
    title: 'Email Support',
    description: 'support@chesscoach.com',
    action: 'Send Email',
  },
];

export function HelpPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="mb-4">How can we help you?</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            className="pl-12 py-3 text-lg"
          />
        </div>
      </div>

      {/* Quick Contact Options */}
      <div className="grid md:grid-cols-3 gap-6">
        {contactOptions.map((option, idx) => (
          <Card key={idx} className="hover:border-accent transition-colors">
            <CardContent className="p-6 text-center">
              <option.icon className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="mb-2">{option.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{option.description}</p>
              <Button variant="outline" className="w-full">
                {option.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQs */}
      <div>
        <h2 className="mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((category, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <category.icon className="w-6 h-6 text-accent" />
                  <h3>{category.category}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.questions.map((item, qIdx) => (
                    <div key={qIdx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <h4 className="mb-2">{item.q}</h4>
                      <p className="text-muted-foreground">{item.a}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <Card className="bg-accent/5 border-accent/50">
        <CardContent className="p-8 text-center">
          <h2 className="mb-3">Still need help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="accent">Contact Support</Button>
            <Button variant="outline">Schedule a Call</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
