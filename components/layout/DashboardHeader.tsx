'use client';

import { Bell, Search, Settings, Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { getNotifications, markAsRead } from '@/lib/actions/notificationActions';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user?.id]);

    async function fetchNotifications() {
        if (!user?.id) return;
        const result = await getNotifications(user.id);
        if (result.success) {
            setNotifications(result.data || []);
            setUnreadCount((result.data || []).filter((n: any) => !n.isRead).length);
        }
    }

    async function handleMarkAsRead(id: string) {
        const result = await markAsRead(id);
        if (result.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    }

    if (!user) return (
        <header className="flex items-center justify-between w-full mb-8 animate-pulse bg-card/50 border border-border px-6 py-3 rounded-2xl">
            <div className="w-48 h-10 bg-muted rounded-lg"></div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="w-10 h-10 bg-muted rounded-full"></div>
            </div>
        </header>
    );

    return (
        <header className="flex items-center justify-between w-full mb-8 bg-card/50 backdrop-blur-sm border border-border px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            {/* Left side: Search bar */}
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search for lessons, students..."
                        className="w-full bg-accent/5 focus:bg-accent/10 border border-border rounded-xl py-2 pl-10 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                </div>
            </div>

            {/* Right side: Notifications & Profile */}
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 pr-4 border-r border-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-card"></span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl border-border bg-card shadow-2xl">
                            <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                                <span className="font-bold">Notifications</span>
                                {unreadCount > 0 && <Badge variant="secondary" className="bg-accent/10 text-accent border-none">{unreadCount} New</Badge>}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/50" />
                            <div className="max-h-[350px] overflow-y-auto space-y-1 mt-1">
                                {notifications.length === 0 ? (
                                    <div className="py-8 text-center text-muted-foreground text-sm">
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <DropdownMenuItem
                                            key={n.id}
                                            className={`group flex flex-col items-start gap-1 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${!n.isRead
                                                ? 'bg-accent/10 hover:bg-accent hover:text-white border-l-4 border-accent shadow-sm'
                                                : 'hover:bg-accent/80 hover:text-white opacity-80'
                                                }`}
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                if (!n.isRead) {
                                                    await handleMarkAsRead(n.id);
                                                }
                                                if (n.link) {
                                                    router.push(n.link);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start justify-between w-full gap-2 font-medium">
                                                <span className={`text-xs font-bold uppercase tracking-wider group-hover:text-white ${!n.isRead ? 'text-accent' : 'text-muted-foreground'}`}>
                                                    {n.type.replace(/_/g, ' ')}
                                                </span>
                                                {!n.isRead && (
                                                    <div className="w-2 h-2 bg-accent group-hover:bg-white rounded-full animate-pulse" title="Unread" />
                                                )}
                                            </div>
                                            <p className={`text-xs leading-relaxed line-clamp-2 group-hover:text-white/90 ${!n.isRead ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-white/60 mt-1 tabular-nums">
                                                <Clock className="w-2.5 h-2.5 group-hover:text-white/60" />
                                                {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-xl">
                        <Settings className="w-5 h-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold leading-tight">{user.name || 'User'}</span>
                        <span className="text-[11px] text-muted-foreground leading-tight">{user.email}</span>
                        {user.role && (
                            <span className="text-[9px] font-bold tracking-widest uppercase text-accent/70 mt-0.5">{user.role}</span>
                        )}
                    </div>
                    <Avatar className="w-10 h-10 border-2 border-accent/20 ring-4 ring-accent/5">
                        <AvatarImage src={user.image || ''} alt={user.name || 'Profile'} />
                        <AvatarFallback className="bg-accent/10 text-accent text-sm font-bold">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
