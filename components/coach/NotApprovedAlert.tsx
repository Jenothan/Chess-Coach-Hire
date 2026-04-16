'use client';

import { ShieldAlert, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function NotApprovedAlert() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        router.push('/login');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                        <ShieldAlert className="w-16 h-16 text-yellow-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight">Account Pending Approval</h1>
                    <p className="text-muted-foreground text-lg">
                        Your coach account has been successfully registered, but it is currently under review by our administration team.
                    </p>
                    <div className="p-4 bg-accent/5 border border-border rounded-lg mt-6">
                        <p className="text-sm font-medium">
                            Once approved, you will have full access to your dashboard and be able to receive bookings from students.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button variant="accent" size="lg" className="h-12 text-base font-semibold" onClick={handleGoHome}>
                        <Home className="w-5 h-5 mr-2" />
                        Go to Homepage
                    </Button>
                    <Button variant="outline" size="lg" className="h-12 text-base font-semibold" onClick={handleLogout}>
                        <LogOut className="w-5 h-5 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                    Need help? Contact support at <span className="font-medium text-foreground">support@chesscoach.com</span>
                </p>
            </div>
        </div>
    );
}
