'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Crown, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { loginUser } from '@/lib/actions/authActions';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await loginUser({ email, password });

        if (result.success && result.data) {
            toast.success("Logged in successfully!");
            // Use the role from the database user
            const userRole = result.data.role.toLowerCase();
            router.push(`/${userRole}`);
        } else {
            toast.error(result.error || "Invalid credentials");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <Crown className="w-10 h-10 text-accent" />
                    <span className="text-3xl font-bold">ChessCoach</span>
                </Link>

                <Card>
                    <CardHeader>
                        <h2 className="text-center mb-2 text-2xl font-bold">Welcome Back</h2>
                        <p className="text-center text-muted-foreground text-sm">
                            Sign in to your account to continue
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">


                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-border" />
                                    <span className="text-muted-foreground">Remember me</span>
                                </label>
                                <Link href="/forgot-password" className="text-accent hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full h-10" disabled={loading}>
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <p className="text-center text-xs text-muted-foreground pt-2">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="text-accent hover:underline font-semibold">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
