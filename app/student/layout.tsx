'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Bell, HelpCircle, LogOut, Settings, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProfileData } from '@/lib/actions/userActions';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function StudentLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const result = await getProfileData(userId);
                    if (result.success) {
                        setUserData(result.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch student profile:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const navItems = [
        { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/student/coaches', label: 'Find Coaches', icon: Users },
        { href: '/student/bookings', label: 'My Bookings', icon: Calendar },
        { href: '/student/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card sticky top-0 h-screen flex flex-col">
                <div className="p-6 border-b border-border/50 mb-4 bg-accent/5">
                    <h2 className="text-xl font-bold tracking-tight text-accent flex items-center gap-2">
                        <Crown className="w-6 h-6" />
                        Student Panel
                    </h2>
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
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <DashboardHeader user={userData} />
                {children}
            </main>
        </div>
    );
}
