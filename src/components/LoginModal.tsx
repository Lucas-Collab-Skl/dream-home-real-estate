import { useUser } from "@/app/userContext";
import { Form, Input, Button, Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react";

interface LoginProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onOpen, onClose }: LoginProps) {
    const user = useUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
        console.log("Login data submitted:", data);
        
        handleAuth(data.username as string);
    }

     const handleAuth = (username: string) => {
        user.setIsAuthenticated(true);
        user.setUser({name:username});
        console.log("User authenticated:", user);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} className="mx-auto mt-10">
            <ModalContent>
                <ModalHeader className="flex flex-col">
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </ModalHeader>
                <ModalBody>
                    <Form className="w-full mx-auto"
                    onSubmit={onSubmit}>
                        <Input label="Username" name="username" placeholder="Enter your username" className="mb-4" />
                        <Input type="password" label="Password" name="password" placeholder="Enter your password" className="mb-4" />
                        <Button type="submit" color="primary" className="w-full">
                            Login
                        </Button>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}