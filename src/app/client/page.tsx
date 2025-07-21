"use client";
import { Button } from "@heroui/button";
import { TableBody, Table, TableHeader, TableCell, TableRow, TableColumn, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, select, addToast, Input, NumberInput, Checkbox } from "@heroui/react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { useDisclosure } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { PropertyTypes, Branch, Client } from "@/app/types";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";


export default function ClientPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedPrefType, setSelectedPrefType] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();


    const prefTypeSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPrefType(e.target.value);
    }

    const fetchClients = async () => {
        try {
            const response = await axios.get("/api/list?table=client");
            console.log("Staff fetched:", response.data.tableList);
            setClients(response.data.tableList);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    }



    useEffect(() => {
        fetchClients();
    }, []);


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let clientNo = "";
        let firstName;
        let lastName;
        let isCreated = false;

        const formData = new FormData(e.currentTarget);
        if (selectedClient && selectedClient.clientNo != "") {
            clientNo = selectedClient.clientNo;
            isCreated = true;
        }

        firstName = formData.get('firstName') as string;
        lastName = formData.get('lastName') as string;


        if (isCreated) {
            // edit client
            const res = await axios.put("/api/client/", {
                clientNo: clientNo,
                firstName: firstName,
                lastName: lastName,
                telephone: formData.get('telephone') as string,
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                email: formData.get('email') as string,
                preferredType: formData.get('prefType') as string,
                maxRent: formData.get('maxRent'),
            });
            if (res.status == 200) {
                addToast({
                    title: "Success",
                    description: `${firstName} ${lastName} has been edited successfully`,
                    color: "success"
                });
            } else {
                addToast({
                    title: "Error",
                    description: "Client couldn't be edited",
                    color: "danger"
                });
            }
        } else {
            // add client
            const res = await axios.post("/api/client/", {
                clientNo: clientNo,
                firstName: firstName,
                lastName: lastName,
                telephone: formData.get('telephone') as string,
                street: formData.get('street') as string,
                city: formData.get('city') as string,
                email: formData.get('email') as string,
                preferredType: formData.get('prefType') as string,
                maxRent: formData.get('maxRent'),
            });

            if (res.status == 200) {
                addToast({
                    title: "Success",
                    description: res.data.message,
                    color: "success"
                });
            } else {
                addToast({
                    title: "Error",
                    description: res.data.error,
                    color: "danger"
                });
            }
        }



        // get staff list again
        await fetchClients();

        onClose();
    }

    const onDelete = async () => {
        if (selectedClient) {
            const res = await axios.delete("/api/client", {
                data: { clientNo: selectedClient.clientNo }
            });

            if (res.status == 200) {
                addToast({
                    title: "Success",
                    description: res.data.message,
                    color: "success"
                });
            } else {
                addToast({
                    title: "Error",
                    description: res.data.error,
                    color: "danger"
                });
            }

            // get staff list again
            await fetchClients();
        }
        onDeleteClose();
    }

    const newHireClient: Client = {
        clientNo: "",
        firstName: "",
        lastName: "",
        telephone: "",
        street: "",
        city: "",
        email: "",
        preferredType: "",
        maxRent: 0
    }

    return (
        <main className="flex flex-col items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Client Management</h1>
            <Button color="secondary" variant="flat" className="w-32 mb-5" onPress={() => { setSelectedClient(newHireClient); onOpen(); }}>Add Client</Button>
            <Table isStriped className="w-full px-2 lg:px-10">
                <TableHeader>
                    <TableColumn>Client No</TableColumn>
                    <TableColumn>First Name</TableColumn>
                    <TableColumn>Last Name</TableColumn>
                    <TableColumn>Telephone</TableColumn>
                    <TableColumn>Street</TableColumn>
                    <TableColumn>City</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Preference</TableColumn>
                    <TableColumn>Max Rent</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {clients && clients.map((row) => (
                        <TableRow key={row.clientNo}>
                            <TableCell>{row.clientNo}</TableCell>
                            <TableCell>{row.firstName}</TableCell>
                            <TableCell>{row.lastName}</TableCell>
                            <TableCell>{row.telephone}</TableCell>
                            <TableCell>{row.street}</TableCell>
                            <TableCell>{row.city}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.preferredType}</TableCell>
                            <TableCell>{row.maxRent}</TableCell>
                            <TableCell>
                                <Tooltip content="Edit">
                                    <Button variant="light" color="secondary" onPress={() => { setSelectedClient(row); onOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
                                        <HiOutlinePencilAlt className="size-7 text-secondary" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Delete">
                                    <Button variant="light" color="danger" onPress={() => { setSelectedClient(row); onDeleteOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
                                        <HiOutlineTrash className="size-7 text-danger" />
                                    </Button>
                                </Tooltip>
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl" className="mx-auto mt-10">
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        <h2 className="text-2xl font-bold text-center">{selectedClient?.clientNo != "" ? 'Edit Client' : 'Add Client'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedClient && (
                            <form className="w-full mx-auto flex flex-col gap-10" onSubmit={onSubmit}>
                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                    <Input required label="First Name" labelPlacement="outside" type="text" name="firstName" defaultValue={selectedClient.firstName} className="w-full  rounded-lg" />
                                    <Input required label="Last Name" labelPlacement="outside" type="text" name="lastName" defaultValue={selectedClient.lastName} className="w-full rounded-lg" />
                                </div>
                                <div className="flex flex-col lg:flex-row justify-between gap-4">

                                    <Input required label="Telephone" labelPlacement="outside" type="tel" name="telephone" defaultValue={selectedClient.telephone} className="w-full  rounded-lg" />

                                    <Input required label="Street" labelPlacement="outside" type="text" name="street" defaultValue={selectedClient.street} className="w-full  rounded-lg" />
                                    <Input required label="City" labelPlacement="outside" type="text" name="city" defaultValue={selectedClient.city} className="w-full  rounded-lg" />

                                </div>

                                <Input required label="Email" labelPlacement="outside" type="email" name="email" defaultValue={selectedClient.email} className="w-full  rounded-lg" />

                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                    <Select required label="Preferred Type" labelPlacement="outside" name="prefType" className="w-full rounded-lg"
                                        selectedKeys={[selectedPrefType]}
                                        onChange={prefTypeSelectionChange}>
                                        {PropertyTypes.map(type => (
                                            <SelectItem key={type}>{type}</SelectItem>
                                        ))}
                                    </Select>

                                    <NumberInput
                                        required
                                        label="Max Rent"
                                        labelPlacement="outside"
                                        type="number" name="maxRent" defaultValue={selectedClient.maxRent} className="w-full rounded-lg" />
                                </div>

                                <Button type="submit" color="primary" className="w-full">
                                    {selectedClient?.clientNo != "" ? 'Save Changes' : 'Add'}
                                </Button>

                            </form>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteClose} size="3xl" className="mx-auto mt-10">
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        <h2 className="text-2xl font-bold text-center">Delete Staff</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-center">Are you sure you want to delete staff member {selectedClient?.firstName} {selectedClient?.lastName}?</p>
                        <div className="flex justify-center mt-4">
                            <Button color="danger" variant="flat" className="w-32 mr-2" onPress={onDelete}>Yes, I'm sure</Button>
                            <Button color="secondary" variant="flat" className="w-32" onPress={onDeleteClose}>Cancel</Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>



        </main>

    );
}