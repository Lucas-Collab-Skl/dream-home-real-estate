import { NextRequest, NextResponse } from "next/server";
import dbConn from "@/app/api/lib/oracledb";
import oracledb from "oracledb";

export async function POST(req: NextRequest) {
    const { firstName, lastName, position, DOB, salary, branchNo, telephone, mobile, email} = await req.json();

    try {
        // create connection to the db
        const connection = await dbConn();

        // UPDATE staff
        const updateStaff = await connection.execute(`BEGIN STAFF_HIRE_SP 
            (:firstName, :lastName, :position, :DOB, :salary, :branchNo, :telephone, :mobile, :email, :staffNo); 
            END;`, {
            firstName: firstName,
            lastName: lastName,
            position: position,
            DOB: DOB,
            salary: salary,
            branchNo: branchNo,
            telephone: telephone,
            mobile: mobile,
            email: email,
            staffno: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        });
        // get the staffNo from the insert
        const staffNo = await updateStaff.outBinds.staffno;

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Staff member (${staffNo}) ${firstName} ${lastName} was successfully registered.`}, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}
