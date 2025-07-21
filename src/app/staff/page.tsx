"use client";
import { Button } from "@heroui/button";
import { TableBody, Table, TableHeader, TableCell, TableRow, TableColumn, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, select, addToast, Input, NumberInput, Checkbox } from "@heroui/react";
import { Select, SelectSection, SelectItem } from "@heroui/select";
import {HiOutlineTrash, HiOutlinePencil, HiOutlinePencilAlt} from "react-icons/hi";
import { useDisclosure } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Staff, Branch } from "@/app/types";


export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [createUser, setCreateUser] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [branches, setBranches] = useState<Branch[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();


    const branchSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranch(e.target.value);
    }

    const fetchStaff = async () => {
        try {
            const response = await axios.get("/api/list?table=staff");
            console.log("Staff fetched:", response.data.tableList);
            setStaff(response.data.tableList);
        } catch (error) {
            console.error("Error fetching staff:", error);
        }
    }

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
        fetchStaff();
    }, []);

    const formatDateForInput = (date: Date | string): string => {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toISOString().split('T')[0];
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let staffNo = "";
        let firstName;
        let lastName;
        let isHired = false;

        const formData = new FormData(e.currentTarget);
        if (selectedStaff && selectedStaff.staffNo != "") {
            staffNo = selectedStaff.staffNo;
            isHired = true;
        }

        firstName = formData.get('firstName') as string;
        lastName = formData.get('lastName') as string;


        if (isHired) {
            // edit
            const res = await axios.put("/api/staff", {
                staffNo: staffNo,
                firstName: firstName,
                lastName: lastName,
                position: formData.get('position') as string,
                branchNo: formData.get('branchNo') as string,
                DOB: formData.get('DOB') as string,
                salary: formData.get('salary'),
                telephone: formData.get('telephone') as string,
                mobile: formData.get('mobile') as string,
                email: formData.get('email') as string,
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
            // hire
            const res = await axios.post("/api/staff", {
                staffNo: staffNo,
                firstName: firstName,
                lastName: lastName,
                position: formData.get('position') as string,
                branchNo: formData.get('branchNo') as string,
                DOB: formData.get('DOB') as string,
                salary: formData.get('salary'),
                telephone: formData.get('telephone') as string,
                mobile: formData.get('mobile') as string,
                email: formData.get('email') as string,
                username: formData.get('username') as string,
                password: formData.get('password') as string,
                createUser: createUser
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
        await fetchStaff();

        onClose();
    }
    
    const onDelete = async () => {
        if (selectedStaff) {
            const res = await axios.delete("/api/staff", {
                data: { staffNo: selectedStaff.staffNo }
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
            await fetchStaff();
        }
        onDeleteClose();
    }

    const newHireStaff: Staff = {
        staffNo: "",
        firstName: "",
        lastName: "",
        position: "",
        sex: "",
        DOB: new Date(),
        salary: 0,
        branchNo: "",
        telephone: "",
        mobile: "",
        email: ""
    }

    return (
        <main className="flex flex-col items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
            <Button color="secondary" variant="flat" className="w-32 mb-5" onPress={() => { fetchBranches(); setSelectedStaff(newHireStaff); onOpen(); }}>Hire</Button>
            <Table isStriped className="w-full px-2 lg:px-10">
                <TableHeader>
                    <TableColumn>Staff No</TableColumn>
                    <TableColumn>First Name</TableColumn>
                    <TableColumn>Last Name</TableColumn>
                    <TableColumn>Position</TableColumn>
                    <TableColumn>Sex</TableColumn>
                    <TableColumn>Date of Birth</TableColumn>
                    <TableColumn>Salary</TableColumn>
                    <TableColumn>Branch No</TableColumn>
                    <TableColumn>Telephone</TableColumn>
                    <TableColumn>Mobile</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn className="text-center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                    {staff && staff.map((row) => (
                        <TableRow key={row.staffNo}>
                            <TableCell>{row.staffNo}</TableCell>
                            <TableCell>{row.firstName}</TableCell>
                            <TableCell>{row.lastName}</TableCell>
                            <TableCell>{row.position}</TableCell>
                            <TableCell>{row.sex}</TableCell>
                            <TableCell>{row.DOB instanceof Date ? row.DOB.toLocaleDateString() : new Date(row.DOB).toLocaleDateString()}</TableCell>
                            <TableCell>{row.salary}</TableCell>
                            <TableCell>{row.branchNo}</TableCell>
                            <TableCell>{row.telephone}</TableCell>
                            <TableCell>{row.mobile}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell className="text-center">
                                
                                <Tooltip content="Edit">
                                    <Button variant="light" color="secondary" onPress={() => { fetchBranches(); setSelectedStaff(row); onOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
                                        <HiOutlinePencilAlt className="size-7 text-secondary" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Delete">
                                    <Button variant="light" color="danger" onPress={() => { setSelectedStaff(row); onDeleteOpen(); }} isIconOnly className="text-slate-700 cursor-pointer active:opacity-50">
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
                        <h2 className="text-2xl font-bold text-center">{selectedStaff?.staffNo != "" ? 'Edit Staff' : 'Hire Staff'}</h2>
                    </ModalHeader>
                    <ModalBody>
                        {selectedStaff && (
                            <form className="w-full mx-auto flex flex-col gap-10" onSubmit={onSubmit}>
                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                    <Input required isDisabled={selectedStaff.staffNo != ""} label="First Name" labelPlacement="outside" type="text" name="firstName" defaultValue={selectedStaff.firstName} className="w-full  rounded-lg" />
                                    <Input required isDisabled={selectedStaff.staffNo != ""} label="Last Name" labelPlacement="outside" type="text" name="lastName" defaultValue={selectedStaff.lastName} className="w-full rounded-lg" />
                                    <Input required isDisabled={selectedStaff.staffNo != ""} label="Position" labelPlacement="outside" type="text" name="position" defaultValue={selectedStaff.position} className="w-full  rounded-lg" />

                                </div>
                                <div className="flex flex-col lg:flex-row justify-between gap-4">

                                    <Select required isDisabled={selectedStaff.staffNo != ""} label="BranchNo" labelPlacement="outside" name="branchNo" className="w-full  rounded-lg"
                                        selectedKeys={[selectedBranch]}
                                        onChange={branchSelectionChange}>
                                        {branches.map(branch => (
                                            <SelectItem key={branch.branchNo}>{branch.branchNo}</SelectItem>
                                        ))}
                                    </Select>


                                    <Input required isDisabled={selectedStaff.staffNo != ""} label="DOB" labelPlacement="outside" type="date" name="DOB" defaultValue={formatDateForInput(selectedStaff.DOB)} className="w-full  rounded-lg" />


                                    <NumberInput
                                        required
                                        label="Salary"
                                        labelPlacement="outside"
                                        type="number" name="salary" defaultValue={selectedStaff.salary} className="w-full rounded-lg" />

                                </div>
                                <div className="flex flex-col lg:flex-row justify-between gap-4">

                                    <Input required label="Telephone" labelPlacement="outside" type="tel" name="telephone" defaultValue={selectedStaff.telephone} className="w-full  rounded-lg" />

                                    <Input required label="Mobile" labelPlacement="outside" type="tel" name="mobile" defaultValue={selectedStaff.mobile} className="w-full  rounded-lg" />

                                </div>

                                <Input required label="Email" labelPlacement="outside" type="email" name="email" defaultValue={selectedStaff.email} className="w-full  rounded-lg" />



                                <div className="flex flex-col">
                                    <Checkbox hidden={selectedStaff.staffNo == ""} isSelected={createUser} onValueChange={setCreateUser}>Create User Account?</Checkbox>
                                    <div className="flex flex-col lg:flex-row justify-between gap-4 mt-4">
                                        <Input required={createUser} name="username" className={`${createUser ? 'block' : 'hidden'}`} label="Username" labelPlacement="outside"></Input>
                                        <Input required={createUser} name="password" className={`${createUser ? 'block' : 'hidden'}`} label="Password" labelPlacement="outside"></Input>
                                    </div>
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
                        <h2 className="text-2xl font-bold text-center">Delete Staff</h2>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-center">Are you sure you want to delete staff member {selectedStaff?.firstName} {selectedStaff?.lastName}?</p>
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