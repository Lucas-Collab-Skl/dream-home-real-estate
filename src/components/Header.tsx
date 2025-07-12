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
import { Link } from "@heroui/link";
import LoginModal from "@/components/LoginModal";
import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/app/userContext";
import { useDisclosure } from "@heroui/react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
    const user = useUser();

    const logout = () => {
        user.setIsAuthenticated(false);
        user.setUser(null);
        onLoginClose();

        // delete user from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
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
                    <NavbarBrand as="a" href="/">
                        <Image className="mr-2" src="/house.jpg" alt="Logo" width={40} height={40} />
                        <p className="text-xl text-secondary text-inherit">Dream House</p>
                    </NavbarBrand>
                </NavbarContent>
                {user.isAuthenticated && (
                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
                    </NavbarContent>
                )}
                <NavbarContent justify="end">
                    <NavbarItem className="hidden md:flex">
                        {user.isAuthenticated ? (
                            <Button color="secondary" variant="faded" onPress={logout}>Logout</Button>
                        ) : (
                            <Button color="secondary" variant="faded" onPress={onLoginOpen}>Login</Button>
                        )}

                    </NavbarItem>

                </NavbarContent>
                <NavbarMenu>



                    {user.isAuthenticated && (
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
                        {user.isAuthenticated ? (
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