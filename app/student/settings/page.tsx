'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getProfileData, updateStudentProfile, changePassword, uploadProfilePicture } from '@/lib/actions/userActions';
import { getInitials } from '@/lib/utils';
import { Camera, Pencil } from 'lucide-react';

export default function StudentSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    // For demo/simulated session (should be getting from auth context in real app)
    const userId = 'cmnpk97ln0000xkc4kq9m000w'; // Should be dynamic in a real app

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            const result = await getProfileData(userId);
            if (result.success && result.data) {
                const user = result.data;
                setProfile(user);
                setName(user.name || '');
                setImage(user.image || '');
            }
            setLoading(false);
        }
        loadProfile();
    }, [userId]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        let finalImageUrl = image;

        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const uploadResult = await uploadProfilePicture(formData);
            if (uploadResult.success && uploadResult.url) {
                finalImageUrl = uploadResult.url;
            } else {
                toast.error(uploadResult.error || "Failed to upload image");
                setUploading(false);
                return;
            }
        }

        const result = await updateStudentProfile(userId, { name, image: finalImageUrl });

        if (result.success) {
            toast.success("Profile updated successfully!");
            setSelectedFile(null);
        } else {
            toast.error(result.error);
        }
        setUploading(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        const result = await changePassword(userId, { currentPassword, newPassword });
        if (result.success) {
            toast.success("Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error(result.error);
        }
    };

    const handleAvatarClick = () => {
        setIsPreviewOpen(true);
    };

    const handleEditClick = () => {
        imageInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading settings...</div>;
    if (!profile) return <div className="p-8 text-center text-destructive">Error loading profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-6">
                <div
                    className="group relative w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent overflow-hidden border-2 border-accent/10 cursor-pointer hover:border-accent/30 transition-all shrink-0"
                    onClick={handleAvatarClick}
                >
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                    ) : (
                        getInitials(name)
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-8 h-8" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-accent h-8 w-8 p-0"
                            onClick={handleEditClick}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </div>
                    <p className="text-muted-foreground">Manage your account and security</p>
                </div>
            </div>

            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none flex items-center justify-center">
                    <div className="relative max-w-full max-h-[80vh] bg-white p-2 rounded-lg shadow-2xl">
                        {image ? (
                            <img src={image} alt={name} className="max-w-full max-h-[75vh] object-contain rounded" />
                        ) : (
                            <div className="w-64 h-64 flex items-center justify-center bg-accent/20 text-accent text-6xl font-bold rounded">
                                {getInitials(name)}
                            </div>
                        )}
                        <div className="mt-4 text-center font-medium text-gray-800">{name}</div>
                    </div>
                </DialogContent>
            </Dialog>

            <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Personal Information</h3>
                            <p className="text-sm text-muted-foreground">Update your account details</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input value={profile.email} disabled className="bg-muted ring-offset-background" />
                                    <p className="text-xs text-muted-foreground italic">Email changes are restricted for security.</p>
                                </div>
                                <Button type="submit" variant="accent" disabled={uploading}>
                                    {uploading ? "Updating..." : "Save Changes"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-xl font-semibold">Security</h3>
                            <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Current Password</label>
                                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Password</label>
                                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirm New Password</label>
                                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" variant="accent">Change Password</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Student Account</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Rating</span>
                                <span className="font-medium text-accent">{profile.studentProfile?.rating || 1200}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Lessons Completed</span>
                                <span className="font-medium">{profile.studentProfile?.lessonsCompleted || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Member Since</span>
                                <span className="font-medium">{new Date(profile.studentProfile?.joinedDate).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
