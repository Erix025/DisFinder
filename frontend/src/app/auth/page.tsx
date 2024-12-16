// app/auth/page.tsx
'use client';

import React from 'react';
import { Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import Navbar from '../../components/Navbar';
import { ErrorCode } from "../../models/error"
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPage() {
    const [selected, setSelected] = React.useState("login");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        // check if email and password are empty
        if (email == "") {
            alert("Email is required");
            setIsLoading(false);
            return;
        }
        if (password == "") {
            alert("Password is required");
            setIsLoading(false);
            return;
        }
        // check email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            setIsLoading(false);
            return;
        }

        const req: UserLoginReq = {
            email: email,
            password: password,
        }

        try {
            const response = await fetch(`${apiUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
                credentials: 'include',
            });

            const resp: Response = await response.json();
            console.log(resp)
            if (resp.code == ErrorCode.NoErr) {
                setIsLoading(false);
                router.push('/');
            } else {
                setIsLoading(false);
                alert(resp.msg);
            }
        }
        catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        // check if username, email and password are empty
        if (username == "") {
            alert("Name is required");
            setIsLoading(false);
            return;
        }
        if (email == "") {
            alert("Email is required");
            setIsLoading(false);
            return;
        }
        if (password == "") {
            alert("Password is required");
            setIsLoading(false);
            return;
        }
        // check email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format");
            setIsLoading(false);
            return;
        }

        const req: UserRegisterReq = {
            email: email,
            name: username,
            password: password,
        }

        try {
            const response = await fetch(`${apiUrl}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
                credentials: 'include',
            });

            const resp: Response = await response.json();
            console.log(resp)
            if (resp.code == ErrorCode.NoErr) {
                setIsLoading(false);
                setPassword("");
                setUsername("");
                setEmail(email);
                setSelected("login");
                alert("Register successfully");
            } else {
                setIsLoading(false);
                alert(resp.msg);
            }
        }
        catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen text-foreground bg-background">
            {/* Navbar */}
            <Navbar />
            <div className='max-w-3xl mt-20 mx-auto max-w-md'>
                <div className="flex flex-col w-full">
                    <Card className="max-w-full w-[340px] h-[400px]">
                        <CardBody className="overflow-hidden">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Tabs form"
                                selectedKey={selected}
                                onSelectionChange={setSelected}
                            >
                                <Tab key="login" title="Login">
                                    <form className="flex flex-col gap-4 h-full">
                                        <Input isRequired label="Email" placeholder="Enter your email" type="email" onChange={(e) => setEmail(e.target.value)} />
                                        <Input
                                            isRequired
                                            label="Password"
                                            placeholder="Enter your password"
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <p className="text-center text-small">
                                            Need to create an account?{" "}
                                            <Link size="sm" onPress={() => setSelected("sign-up")}>
                                                Sign up
                                            </Link>
                                        </p>
                                        <div className="flex gap-2 justify-end">
                                            <Button fullWidth color="primary" onClick={handleLogin} isLoading={isLoading} disabled={isLoading}>
                                                Login
                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                                <Tab key="sign-up" title="Sign up">
                                    <form className="flex flex-col gap-4 h-[300px]">
                                        <Input isRequired label="Name" placeholder="Enter your name" type="text" onChange={(e) => setUsername(e.target.value)} />
                                        <Input isRequired label="Email" placeholder="Enter your email" type="email" onChange={(e) => setEmail(e.target.value)} />
                                        <Input
                                            isRequired
                                            label="Password"
                                            placeholder="Enter your password"
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <p className="text-center text-small">
                                            Already have an account?{" "}
                                            <Link size="sm" onPress={() => setSelected("login")}>
                                                Login
                                            </Link>
                                        </p>
                                        <div className="flex gap-2 justify-end">
                                            <Button fullWidth color="primary" onClick={handleRegister}>
                                                Sign up
                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

