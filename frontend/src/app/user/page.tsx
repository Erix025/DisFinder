// app/user/page.tsx
'use client';

import Navbar from '../../components/Navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, Card, CardBody } from '@nextui-org/react';

export default function UserProfile() {
    const user = {
        name: '张三',
        email: 'zhangsan@example.com',
    };

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
                            <span>{user.name}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="font-semibold">Email</span>
                            <span>{user.email}</span>
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
