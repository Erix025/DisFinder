'use client';  // 表明该组件在客户端渲染

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Button } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { WishlistIcon } from "./WishlistIcon.jsx";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ErrorCode } from "../models/error"
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function App() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLogin, setIsLogin] = useState<boolean>(true);

    const handleLogout = async () => {
        const response = await fetch(`${apiUrl}/api/user/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        if (resp.code == ErrorCode.NoErr) {
            setIsLogin(false);
            setUser(null);
            router.push('/');
        } else {
            console.error(resp.msg);
        }
    }

    const handleHome = () => {
        router.push('/');
    }

    const handleWishlist = () => {
        router.push('/wishlist');
    }

    const handleProfile = () => {
        router.push('/user');
    }

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
                setIsLogin(true);
            } else if (resp.code == ErrorCode.ErrNotLogin) {
                setIsLogin(false);
            } else {
                console.error(resp.msg);
            }

        };
        fetchUser();
    }, []);


    return (
        <Navbar isBordered className="text-foreground bg-background">
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <button onClick={handleHome} className="flex items-center" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <AcmeLogo />
                        <p className="hidden sm:block font-bold text-inherit">DisFinder</p>
                    </button>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-3">
                    {/* <NavbarItem>
                        <Link color="foreground" href="#">
                            Features
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#" aria-current="page" color="secondary">
                            Customers
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Integrations
                        </Link>
                    </NavbarItem> */}
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                {/* <Input
                    classNames={{
                        base: "max-w-full sm:max-w-[10rem] h-10",
                        mainWrapper: "h-full",
                        input: "text-small",
                        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                    }}
                    placeholder="Type to search..."
                    size="sm"
                    startContent={<SearchIcon size={18} />}
                    type="search"
                /> */}
                <Button className="bg-secondary-50 text-secondary-500" color="secondary" variant="bordered" aria-label="Toggle Dark Mode" onClick={
                    () => setTheme(theme === 'dark' ? 'light' : 'dark')
                }>
                    Toggle Dark Mode
                </Button>

                <Button className="bg-danger-50 text-danger-500" color="danger" variant="bordered" aria-label="Wishlist" startContent={<WishlistIcon />}
                    onClick={handleWishlist}
                >
                    Wishlist
                </Button>

                {isLogin ? (
                    <Dropdown placement="bottom-end" className="text-foreground bg-background">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2" onClick={handleProfile}>
                                <p className="font-semibold">{user?.name}</p>
                                <p className="font-semibold">{user?.email}</p>
                            </DropdownItem>
                            <DropdownItem key="settings" onClick={handleProfile}>My Settings</DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <Link href="/auth">
                        <Button className="bg-primary-500 text-primary-50" color="primary" variant="solid" aria-label="Login">
                            Login
                        </Button>
                    </Link>
                )}


            </NavbarContent>
        </Navbar>
    );
}