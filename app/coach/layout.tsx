'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Bell, HelpCircle, LogOut } from 'lucide-react';

export default function CoachLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/coach', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/coach/schedule', label: 'Schedule', icon: Calendar },
    ];

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
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
