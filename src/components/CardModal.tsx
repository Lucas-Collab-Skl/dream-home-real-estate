import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react";

interface CardModalProps {
    title: string;
    description: string;
    imageUrl: string;
    onOpen?: () => void;
    onClose?: () => void;
    isOpen?: boolean;
}

export default function CardModal({ title, description, imageUrl, isOpen, onOpen, onClose }: CardModalProps) {
    return (
        <Modal size="5xl" isOpen={isOpen} onOpenChange={onClose} className="mx-auto mt-10">
            <ModalContent className="mx-auto mt-10">
                <ModalHeader className="text-2xl font-bold text-center">
                    {title}
                </ModalHeader>
                <ModalBody className="flex flex-col lg:flex-row items-center">
                    <img src={imageUrl} alt={title} className="w-[60%] object-cover mb-4 rounded-3xl" />
                    {description}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}