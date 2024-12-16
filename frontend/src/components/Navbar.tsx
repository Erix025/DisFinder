'use client';  // 表明该组件在客户端渲染

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Button } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { WishlistIcon } from "./WishlistIcon.jsx";
import { useTheme } from "next-themes";

export default function App() {
    const { theme, setTheme } = useTheme()

    return (
        <Navbar isBordered className="text-foreground bg-background">
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <AcmeLogo />
                    <p className="hidden sm:block font-bold text-inherit">DisFinder</p>
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

                <Button className="bg-danger-50 text-danger-500" color="danger" variant="bordered" aria-label="Wishlist" startContent={<WishlistIcon />}>
                    Wishlist
                </Button>

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
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}