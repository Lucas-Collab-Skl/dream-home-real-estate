import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
} from "@heroui/navbar";

import { Button } from "@heroui/button";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Link } from "@heroui/link";
import LoginModal from "@/components/LoginModal";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/app/userContext";
import { useDisclosure } from "@heroui/react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    const {user, setUser} = useUser();

    const logout = () => {
        setUser(null);
        onLoginClose();

        // delete user from localStorage
        localStorage.removeItem('user');
        window.location.href = "/";
    };

    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} className="backdrop-blur-md">
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <a href="/" className="flex items-center">
                            <Image className="mr-2 rounded-lg" src="/cropped_logo.png" alt="Logo" width={80} height={80} />
                            <p className="text-xl text-secondary text-inherit">Dream House</p>
                        </a>
                    </NavbarBrand>
                </NavbarContent>
                {user && (
                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarItem>
                            <Link color="foreground" href="/staff">
                                Staff
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/branch">
                                Branches
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="/client">
                                Clients
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                )}
                <NavbarContent justify="end">
                    <NavbarItem className="hidden md:flex items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Avatar
                                    src={user ? user?.photo : "/default-avatar.png"}
                                    name={user ? user?.firstName : "Guest"}
                                    className="cursor-pointer"
                                    size="md"
                                />
                            </DropdownTrigger>
                            <DropdownMenu>
                                {user ? (
                                    <>
                                        <DropdownItem key="profile">
                                            <Link href="/profile">Profile</Link>
                                        </DropdownItem>
                                        <DropdownItem key="logout" onPress={logout}>
                                            Logout
                                        </DropdownItem>
                                    </>
                                ) : (
                                    <DropdownItem key="login" onPress={onLoginOpen}>
                                        Login
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>

                    </NavbarItem>

                </NavbarContent>
                <NavbarMenu>



                    {user && (
                        <>
                            <NavbarItem>
                                <Link color="foreground" href="/staff">
                                    Staff
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link color="foreground" href="#">
                                    Branches
                                </Link>
                            </NavbarItem>
                            <NavbarItem>
                                <Link color="foreground" href="#">
                                    Clients
                                </Link>
                            </NavbarItem>
                        </>
                    )}
                    <br />
                    <NavbarItem className="flex justify-end">
                        {user ? (
                            <Button color="secondary" variant="faded" onPress={logout}>Logout</Button>
                        ) : (
                            <Button color="secondary" variant="faded" onPress={onLoginOpen}>Login</Button>
                        )}

                    </NavbarItem>
                </NavbarMenu>
            </Navbar >
            <LoginModal isOpen={isLoginOpen} onOpen={onLoginOpen} onClose={onLoginClose} />
        </>
    );
}