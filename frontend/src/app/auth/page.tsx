// app/auth/page.tsx
'use client';

import { useState } from 'react';
import { Input, Button, Tabs, Tab } from '@nextui-org/react';
import Navbar from '../../components/Navbar';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = () => {
        console.log('Login information:', { email, password });
        // Handle login logic here
    };

    const handleRegister = () => {
        console.log('Registration information:', { username, email, password });
        // Handle registration logic here
    };

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* Navbar */}
            <Navbar />
            <div className='max-w-3xl mt-10 mx-auto max-w-md'>
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <Tabs aria-label="Login/Register Tabs">
                        <Tab key="login" title="Login">
                            <div className="space-y-4 mt-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button onClick={handleLogin} className="mt-4 max-w-xs mx-auto" color="primary" variant="solid">
                                    Login
                                </Button>
                            </div>
                        </Tab>
                        <Tab key="register" title="Register">
                            <div className="space-y-4 mt-4">
                                <Input
                                    label="Username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Button onClick={handleRegister} className="mt-4 max-w-xs mx-auto" color="primary" variant="solid">
                                    Register
                                </Button>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

