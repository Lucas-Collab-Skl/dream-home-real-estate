"use client";
import { Button } from "@heroui/button";
import { TableBody, Table, TableHeader, TableCell, TableRow, TableColumn, Tooltip } from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Staff } from "@/app/types";


export default function StaffPage() {

    const [staff, setStaff] = useState<Staff[]>([]);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/list?table=staff");
                console.log("Staff fetched:", response.data.tableList);
                setStaff(response.data.tableList);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        }
        fetchStaff();
    }, []);

    const hire = async () => {
        await axios.post("http://localhost:3000/api/staff/hire");
    }

    return (
        <main className="flex flex-col items-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Staff Management</h1>
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
                    <TableColumn>Action</TableColumn>
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
                            <TableCell>
                                <Tooltip content="Edit user">
                                    <span className=" text-slate-700 cursor-pointer active:opacity-50">
                                        <EditIcon className="size-7" />
                                    </span>
                                </Tooltip></TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>



            <Button onPress={hire}>Hire</Button>
        </main>

    );
}

export const EditIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 20 20"
            width="1em"
            {...props}
        >
            <path
                d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
            <path
                d="M2.5 18.3333H17.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
        </svg>
    );
};