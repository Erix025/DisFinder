// app/user/page.tsx
'use client';

import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, CardBody } from '@nextui-org/react';
import { ErrorCode } from "../../models/error"

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
                const user_resp: UserGetInfoResp = resp.data;
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
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEditPassword = () => {
        setIsEditingPassword(true);
    };

    const handleSavePassword = () => {
        if (password === confirmPassword) {
            console.log('密码已更新');
            setIsEditingPassword(false);
            setPassword('');
            setConfirmPassword('');
        } else {
            alert('密码不一致，请重新输入');
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
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center">
                            <span className="font-semibold">Username</span>
                            <span>{user?.name}</span>
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
                </CardBody>
            </Card>
        </div>
    );
}
