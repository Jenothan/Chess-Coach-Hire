'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Bell, HelpCircle, LogOut, Settings } from 'lucide-react';
import { getProfileData } from '@/lib/actions/userActions';
import { NotApprovedAlert } from '@/components/coach/NotApprovedAlert';

export default function CoachLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkStatus() {
            // Get userId from localStorage
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const result = await getProfileData(userId);
                if (result.success && result.data && result.data.coachProfile) {
                    setStatus(result.data.coachProfile.status);
                }
            } catch (error) {
                console.error("Failed to check coach status:", error);
            } finally {
                setLoading(false);
            }
        }

        checkStatus();
    }, []);

    const navItems = [
        { href: '/coach', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/coach/schedule', label: 'Schedule', icon: Calendar },
        { href: '/coach/settings', label: 'Settings', icon: Settings },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    // If status is not ACTIVE, show the full-screen alert
    if (status && status.toUpperCase() !== 'ACTIVE') {
        return <NotApprovedAlert />;
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card sticky top-0 h-screen flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold">Coach Panel</h2>
                </div>
                <nav className="px-4 space-y-2 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/10'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => {
                            localStorage.removeItem('userId');
                            localStorage.removeItem('userRole');
                            window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors text-foreground"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
