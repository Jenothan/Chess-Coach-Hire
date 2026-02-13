import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { CreditCard, Lock, CheckCircle, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {
    coach: 'GM Alexander Petrov',
    type: 'single',
    date: '2026-02-15',
    time: '10:00 AM',
    duration: '60',
    amount: 50,
  };

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    setTimeout(() => {
      navigate('/student', { 
        state: { message: 'Booking confirmed! Check your email for details.' }
      });
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2">Complete Payment</h1>
        <p className="text-muted-foreground">Secure payment processing</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3>Payment Method</h3>
            </CardHeader>
            <CardContent>
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Credit Card</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'paypal'
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">PayPal</div>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Card Number</label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Cardholder Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Expiry Date</label>
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">CVV</label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" variant="accent" className="w-full">
                      <Lock className="w-4 h-4 mr-2" />
                      Pay ${bookingData.amount}
                    </Button>
                  </div>
                </form>
              )}

              {/* PayPal Payment */}
              {paymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You will be redirected to PayPal to complete your payment
                  </p>
                  <Button variant="accent" onClick={handlePayment}>
                    Continue with PayPal
                  </Button>
                </div>
              )}

              {/* Security Note */}
              <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <h3>Order Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Booking Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Coach</p>
                    <p className="font-semibold">{bookingData.coach}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lesson Type</p>
                    <p className="font-semibold capitalize">{bookingData.type} Lesson</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold">{bookingData.date}</p>
                    <p className="font-semibold">{bookingData.time}</p>
                  </div>
                  {bookingData.duration && (
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{bookingData.duration} minutes</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${bookingData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-accent">
                      ${bookingData.amount}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Instant confirmation
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Free cancellation up to 24h
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Secure payment processing
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
