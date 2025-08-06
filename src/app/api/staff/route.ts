import { NextRequest, NextResponse } from "next/server";
import dbConn from "@/app/api/lib/oracledb";
import crypto from "crypto";
import oracledb from "oracledb";

export async function POST(req: NextRequest) {
    // comment this out below if you want to create the first user in your db.
    const { firstName, lastName, position, DOB, salary, branchNo, telephone, mobile, email, username, password, createUser } = await req.json();
   
    // const response = await req.json();
    //console.log(response);

    // Uncomment out if you want to create the first user in your db.
    // and change the information

    /*let firstName = "User";
    let lastName = "LastName";
    let position = "CEO";
    let DOB = new Date("2000-02-03");
    let salary = 100000;
    let branchNo = "B002";
    let telephone = "1234567890";
    let mobile = "2269808454";
    let email = "hello@gmail.com";
    let username = "user";
    let password = "pass123";
    let createUser = true;
    */

    // YES, I know this is not secure, this is for a project and to not pass around environment variable files.
    const password_hash = crypto.createHash('sha256').update(password + 'scoobydoobydooSalt').digest('hex');

    // clean salary, remove commans and convert to number.
    const cleanSalary = salary.toString().replace(/,/g, '');
    const salaryNum = parseFloat(cleanSalary);


    try {
        // create connection to the db
        const connection = await dbConn();

        // insert into DH_Staff
        const insertStaff = await connection.execute(`BEGIN STAFF_HIRE_SP 
            (:firstName, :lastName, :position, :DOB, :salary, :branchNo, :telephone, :mobile, :email, :staffNo); 
            END;`, {
            firstName: firstName,
            lastName: lastName,
            position: position,
            DOB: new Date(DOB),
            salary: salaryNum,
            branchNo: branchNo,
            telephone: telephone,
            mobile: mobile,
            email: email,
            staffno: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        });

        // log for debugging purposes
        console.log('New staffno:', insertStaff.outBinds.staffno);


        // get the staffNo from the insert
        const staffNo = await insertStaff.outBinds.staffno;

        if (createUser) {
            // insert into DH_User with the staffNo from the insert
            // makes sure that the staffNo is unique and matches the DH_Staff
            connection.execute(`BEGIN USER_CREATE_SP
            (:staffNo, :username, :password_hash, :role);
            END;`, {
                staffNo: staffNo,
                username: username,
                password_hash: password_hash,
                role: "staff",
            });
        }

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Staff member (${staffNo}) ${firstName} ${lastName} was successfully registered.` }, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}

export async function PUT(req: NextRequest) {
    const { staffNo, salary, telephone, mobile, email} = await req.json();

    const cleanSalary = salary.toString().replace(/,/g, '');
    const salaryNum = parseFloat(cleanSalary);

    try {
        // create connection to the db
        const connection = await dbConn();

        // UPDATE staff
         const updateStaff = await connection.execute(
            `UPDATE DH_STAFF SET 
            salary = :salary, 
            telephone = :telephone, 
            mobile = :mobile, 
            email = :email 
            WHERE staffno = :staffNo`,
            {
                salary: salaryNum,
                telephone: telephone,
                mobile: mobile,
                email: email,
                staffNo: staffNo
            },
            {
                autoCommit: true // Automatically commit the transaction
            }
        );

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Staff member (${staffNo}) was successfully edited.`}, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest) {
    const { staffNo } = await req.json();

    try {
        // create connection to the db
        const connection = await dbConn();


        // Delete from DH_UserAccount first since it has a foreign key constraint
        await connection.execute(`DELETE FROM DH_USERACCOUNT WHERE staffno = :staffNo`,
            {
                staffNo: staffNo
            },
            {
                autoCommit: true // Automatically commit the transaction
            }
        );

        // Delete from DH_STAFF
        await connection.execute(
            `DELETE FROM DH_STAFF WHERE staffno = :staffNo`,
            {
                staffNo: staffNo
            },
            {
                autoCommit: true
            }
        );

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Staff member (${staffNo}) was successfully deleted.`}, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}