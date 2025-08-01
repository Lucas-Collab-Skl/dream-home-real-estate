"use client";
import { Button } from "@heroui/button";
import { TableBody, Table, TableHeader, TableCell, TableRow, TableColumn, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, select, addToast, Input, NumberInput, Checkbox } from "@heroui/react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePencilAlt } from "react-icons/hi";
import { useDisclosure } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Staff, Branch } from "@/app/types";


export default function BranchPage() {
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>();
    const [selectedBranchNo, setSelectedBranchNo] = useState<string>("");
    const [selectedBranchAddress, setSelectedBranchAddress] = useState<string>("");
    const [branches, setBranches] = useState<Branch[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();


    const fetchBranches = async () => {
        try {
            const response = await axios.get("/api/list?table=branch");
            console.log("Branches fetched", response.data.tableList);
            setBranches(response.data.tableList);
        } catch (error) {
            console.error("Error fetching branches", error);
        }
    }

    useEffect(() => {
        fetchBranches();
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isCreated = false;

        const formData = new FormData(e.currentTarget);
        let branchNo = formData.get('branchNo') as string;

        if (selectedBranch && selectedBranch.branchNo != "") {
            branchNo = selectedBranch.branchNo;
            isCreated = true;
        }

        try {


            if (isCreated) {
                // edit
                const res = await axios.put("/api/branch", {
                    branchNo: branchNo,
                    street: formData.get('street') as string,
                    city: formData.get('city') as string,
                    postCode: formData.get('postCode') as string,
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
            } else {
                // create
                const res = await axios.post("/api/branch", {
                    branchNo: branchNo,
                    street: formData.get('street') as string,
                    city: formData.get('city') as string,
                    postCode: formData.get('postCode') as string,
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
            await fetchBranches();

            onClose();
        } catch (error: any) {
            addToast({
                title: "Error",
                description: error.response?.data?.error,
                color: "danger"
            });
        }
    }

    const onDelete = async () => {
        if (selectedBranch) {
            const res = await axios.delete("/api/branch", {
                data: { branchNo: selectedBranch.branchNo }
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

            // get branches list again
            await fetchBranches();
        }
        onDeleteClose();
    }

    const branchNoSelectionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranchNo(e.target.value);

        try {
            const res = await axios.get(`/api/branch?branchNo=${e.target.value}`);
            if (res.status == 200) {
                setSelectedBranchAddress(res.data.branchAddress);
            }

        } catch (error: any) {
            addToast({
                title: "Error",
                description: error?.response.data.error,
                color: "danger"
            });
        }
    }

    const newBranch: Branch = {
        branchNo: "",
        street: "",
        city: "",
        postCode: "",
    }

    return (
        <main className="flex flex-col items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Branch Management</h1>
            <Button color="secondary" variant="flat" className="w-32 mb-5" onPress={() => { fetchBranches(); setSelectedBranch(newBranch); onOpen(); }}>Create</Button>

            <div className="w-full px-2 lg:px-10 flex lg:flex-row gap-6 mb-4">
                <Select required label="Get Branch Address" labelPlacement="outside" name="branchNo" className="w-full  rounded-lg"
                    selectedKeys={[selectedBranchNo]}
                    onChange={branchNoSelectionChange}>
                    {branches.map(branch => (
                        <SelectItem key={branch.branchNo}>{branch.branchNo}</SelectItem>
                    ))}
                </Select>
                <Input isDisabled={true} label="Branch Address" labelPlacement="outside" type="text" name="branchNo" value={selectedBranchAddress} />
            </div>

            <Table isStriped className="w-full px-2 lg:px-10">
                <TableHeader>
                    <TableColumn>Branch No</TableColumn>
                    <TableColumn>Street</TableColumn>
                    <TableColumn>City</TableColumn>
                    <TableColumn>Postal Code</TableColumn>
                    <TableColumn className="text-center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {branches && branches.map((row) => (
                        <TableRow key={row.branchNo}>
                            <TableCell>{row.branchNo}</TableCell>
                            <TableCell>{row.street}</TableCell>
                            <TableCell>{row.city}</TableCell>
                            <TableCell>{row.postCode}</TableCell>
                            <TableCell className="text-center">

                                <Tooltip content="Edit">
                                    <Button variant="light" color="secondary" onPress={() => { fetchBranches(); setSelectedBranch(row); onOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
                                        <HiOutlinePencilAlt className="size-7 text-secondary" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Delete">
                                    <Button variant="light" color="danger" onPress={() => { setSelectedBranch(row); onDeleteOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
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
                        <h2 className="text-2xl font-bold text-center">{selectedBranch?.branchNo != "" ? 'Edit Branch' : 'Create Branch'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedBranch && (
                            <form className="w-full mx-auto flex flex-col gap-10" onSubmit={onSubmit}>
                                <div className="flex flex-col justify-between gap-4">
                                    <Input required isDisabled={selectedBranch.branchNo != ""} label="Branch No" labelPlacement="outside" type="text" name="branchNo" defaultValue={selectedBranch.branchNo}
                                        className="w-full  rounded-lg" />
                                    <div className="flex lg:flex-row flex-col gap-4">
                                        <Input required label="Street" labelPlacement="outside" type="text" name="street" defaultValue={selectedBranch.street}
                                            className="w-full rounded-lg" />
                                        <Input required label="City" labelPlacement="outside" type="text" name="city" defaultValue={selectedBranch.city}
                                            className="w-full rounded-lg" />
                                    </div>
                                    <Input required label="Postal Code" labelPlacement="outside" type="text" name="postCode" defaultValue={selectedBranch.postCode}
                                        className="w-full  rounded-lg" />

                                </div>

                                <Button type="submit" color="primary" className="w-full">
                                    Save Changes
                                </Button>

                            </form>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>


            <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteClose} size="3xl" className="mx-auto mt-10">
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        <h2 className="text-2xl font-bold text-center">Delete Branch</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-center">Are you sure you want to delete branch {selectedBranch?.branchNo}?</p>
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