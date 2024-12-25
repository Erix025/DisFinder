// app/user/page.tsx
'use client';

import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, CardBody } from '@nextui-org/react';
import { ErrorCode } from "../../models/error"
import { User } from '@/models/models';
import { UserGetInfoResp, Response } from '@/models/response';
import { UserUpdatePasswordReq, UserUpdateInfoReq } from '@/models/request'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${apiUrl}/api/user/info`, {
                method: 'GET',
                credentials: 'include',
            });

            const resp: Response = await response.json();
            console.log(resp)
            if (resp.code == ErrorCode.NoErr) {
                const user_resp: UserGetInfoResp = resp.data as UserGetInfoResp;
                const user: User = {
                    id: user_resp.id,
                    name: user_resp.name,
                    email: user_resp.email,
                }
                setUser(user);
            } else if (resp.code == ErrorCode.ErrNotLogin) {
                alert('Please login first');
                router.push('/auth');
            } else {
                console.error(resp.msg);
            }

        };
        fetchUser();
    }, []);

    const router = useRouter();
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleCancelEditPassword = () => {
        setIsEditingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSavePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match. Please try again.');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        try {
            const req: UserUpdatePasswordReq = {
                id: user?.id || 0,
                old_password: currentPassword,
                new_password: newPassword,
            };

            const response = await fetch(`${apiUrl}/api/user/passwd`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            });

            const resp: Response = await response.json();
            if (resp.code === ErrorCode.NoErr) {
                alert('Password updated successfully.');
                handleCancelEditPassword(); // Reset state and exit edit mode
            } else if (resp.code === ErrorCode.ErrNotLogin) {
                alert('Please login first');
                router.push('/auth');
            } else if (resp.code === ErrorCode.ErrPassword) {
                alert('Current password is incorrect. Please try again.');
            } else {
                console.error('Error updating password:', resp.msg);
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const handleEditUsername = () => {
        setNewUsername(user?.name || '');
        setIsEditingUsername(true);
    };

    const handleCancelEditUsername = () => {
        setNewUsername('');
        setIsEditingUsername(false);
    };

    const handleSaveUsername = async () => {
        if (newUsername.trim() === '') {
            alert('Username cannot be empty.');
            return;
        }

        try {
            const req: UserUpdateInfoReq = {
                id: user?.id || 0,
                name: newUsername,
                email: '',
            };

            const response = await fetch(`${apiUrl}/api/user/info`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            });

            const resp: Response = await response.json();
            if (resp.code === ErrorCode.NoErr) {
                alert('Username updated successfully.');
                setUser((prevUser) => prevUser ? { ...prevUser, name: newUsername } : null);
                setIsEditingUsername(false);
            } else {
                alert(`Failed to update username: ${resp.msg}`);
            }
        } catch (error) {
            console.error('Error updating username:', error);
        }
    };

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* 导航栏 */}
            <Navbar />

            {/* 用户信息内容 */}
            <Card className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-default-50">
                <CardBody>
                    <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
                    {!isEditingPassword ? (
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center">
                                <span className="font-semibold">Username</span>
                                {isEditingUsername ? (
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            className='ml-2'
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            placeholder="Enter new username"
                                            required
                                            size="sm"
                                        />
                                        <Button color="primary" onClick={handleSaveUsername} size="sm">
                                            Save
                                        </Button>
                                        <Button color="default" onClick={handleCancelEditUsername} size="sm">
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>{user?.name}</span>
                                        <Button onClick={handleEditUsername} color="primary" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                )}
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="font-semibold">Email</span>
                                <span>{user?.email}</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="font-semibold">Password</span>
                                <Button onClick={handleEditPassword} color='primary'>
                                    Modify
                                </Button>
                            </li>
                        </ul>
                    ) : (
                        <div className="space-y-4">
                            <Input
                                type="password"
                                label="Current Password"
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                label="New Password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                label="Confirm New Password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-4">
                                <Button color="primary" onClick={handleSavePassword}>
                                    Save
                                </Button>
                                <Button color="default" onClick={handleCancelEditPassword}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
