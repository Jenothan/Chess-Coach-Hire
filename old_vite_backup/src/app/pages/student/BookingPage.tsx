import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Calendar as CalendarIcon, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const coach = {
  name: 'GM Alexander Petrov',
  rating: 2650,
  hourlyRate: 50,
  monthlyRate: 400,
};

const availableSlots = [
  { date: '2026-02-15', time: '10:00 AM' },
  { date: '2026-02-15', time: '2:00 PM' },
  { date: '2026-02-15', time: '4:00 PM' },
  { date: '2026-02-16', time: '10:00 AM' },
  { date: '2026-02-16', time: '11:00 AM' },
  { date: '2026-02-16', time: '3:00 PM' },
  { date: '2026-02-17', time: '9:00 AM' },
  { date: '2026-02-17', time: '1:00 PM' },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [
  { day: 'Mon', date: 15, available: true },
  { day: 'Tue', date: 16, available: true },
  { day: 'Wed', date: 17, available: true },
  { day: 'Thu', date: 18, available: false },
  { day: 'Fri', date: 19, available: true },
  { day: 'Sat', date: 20, available: true },
  { day: 'Sun', date: 21, available: false },
];

export function BookingPage() {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState<'single' | 'monthly'>('single');
  const [selectedDate, setSelectedDate] = useState('2026-02-15');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [note, setNote] = useState('');

  const handleBooking = () => {
    navigate('/student/payment', {
      state: {
        coach: coach.name,
        type: bookingType,
        date: selectedDate,
        time: selectedTime,
        duration: duration,
        amount: bookingType === 'single' ? coach.hourlyRate * (parseInt(duration) / 60) : coach.monthlyRate,
      }
    });
  };

  const availableTimes = availableSlots
    .filter(slot => slot.date === selectedDate)
    .map(slot => slot.time);

  const totalAmount = bookingType === 'single' 
    ? coach.hourlyRate * (parseInt(duration) / 60)
    : coach.monthlyRate;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/student/coaches">
        <Button variant="ghost" size="sm">
          ← Back to Coaches
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="mb-2">Book a Lesson</h1>
        <p className="text-muted-foreground">Schedule your session with {coach.name}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Type */}
          <Card>
            <CardHeader>
              <h3>Select Lesson Type</h3>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setBookingType('single')}
                  className={`p-6 border-2 rounded-lg transition-colors text-left ${
                    bookingType === 'single'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4>Single Lesson</h4>
                    {bookingType === 'single' && (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-2xl font-bold mb-2">${coach.hourlyRate}/hr</p>
                  <p className="text-sm text-muted-foreground">
                    Perfect for one-time sessions or trying out a coach
                  </p>
                </button>

                <button
                  onClick={() => setBookingType('monthly')}
                  className={`p-6 border-2 rounded-lg transition-colors text-left ${
                    bookingType === 'monthly'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4>Monthly Plan</h4>
                    {bookingType === 'monthly' && (
                      <CheckCircle className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <p className="text-2xl font-bold mb-2">${coach.monthlyRate}/mo</p>
                  <p className="text-sm text-muted-foreground">
                    8 lessons per month • Save ${(coach.hourlyRate * 8) - coach.monthlyRate}
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <h3>Select Date</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => d.available && setSelectedDate(`2026-02-${d.date}`)}
                    disabled={!d.available}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      selectedDate === `2026-02-${d.date}`
                        ? 'border-accent bg-accent/10'
                        : d.available
                        ? 'border-border hover:border-accent/50'
                        : 'border-border opacity-30 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs text-muted-foreground mb-1">{d.day}</div>
                    <div className="font-bold">{d.date}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card>
            <CardHeader>
              <h3>Select Time</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimes.map((time, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedTime === time
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm font-semibold">{time}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration (Single Lesson Only) */}
          {bookingType === 'single' && (
            <Card>
              <CardHeader>
                <h3>Lesson Duration</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {['60', '90', '120'].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setDuration(dur)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        duration === dur
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="font-bold">{dur} min</div>
                      <div className="text-sm text-muted-foreground">
                        ${coach.hourlyRate * (parseInt(dur) / 60)}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <h3>Additional Notes (Optional)</h3>
            </CardHeader>
            <CardContent>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your goals, current level, or any specific topics you'd like to focus on..."
                className="w-full p-3 bg-input-background border border-border rounded-lg min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <h3>Booking Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Coach Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-xl">
                    {coach.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{coach.name}</p>
                    <p className="text-sm text-muted-foreground">Rating: {coach.rating}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold capitalize">{bookingType} Lesson</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-semibold">{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                  )}
                  {bookingType === 'single' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">{duration} minutes</span>
                    </div>
                  )}
                  {bookingType === 'monthly' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-semibold">8 per month</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg">Total:</span>
                    <span className="text-2xl font-bold text-accent">
                      ${totalAmount}
                    </span>
                  </div>
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={handleBooking}
                    disabled={!selectedTime}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>

                {/* Info */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    💡 You can cancel or reschedule up to 24 hours before the lesson
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
