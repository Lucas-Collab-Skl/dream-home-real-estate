import { NextRequest, NextResponse } from "next/server";
import dbConn from "@/app/api/lib/oracledb";
import oracledb from "oracledb";


export async function GET(req: NextRequest) {
    const branchNo = req.nextUrl.searchParams.get("branchNo") || "";

    try {
        // create connection to the db
        const connection = await dbConn();

        // fetch branch addresss
        const result = await connection.execute(
            `BEGIN :result := GET_BRANCH_ADDRESS(:branchNo); END;`,
            {
                branchNo: branchNo,
                result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
            }
        );

        // close the connection
        await connection.close();

        return NextResponse.json({ 
            branchNo: branchNo,
            branchAddress: result.outBinds.result 
        }, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const { branchNo, street, city, postCode } = await req.json();

    try {
        // create connection to the db
        const connection = await dbConn();

        // insert into DH_BRANCH
        const insertBranch = await connection.execute(`BEGIN NEW_BRANCH(:branchNo, :street, :city, :postCode); END;`, {
            branchNo: branchNo,
            street: street,
            city: city,
            postCode: postCode
        }, {
            autoCommit: false // handles its own commit
        });

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Branch (${branchNo}) was successfully registered.` }, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}

export async function PUT(req: NextRequest) {
    const { branchNo, street, city, postCode } = await req.json();

    try {
        // create connection to the db
        const connection = await dbConn();

        // UPDATE staff
         const updateStaff = await connection.execute(
            `UPDATE DH_BRANCH SET 
            street = :street, 
            city = :city, 
            postcode = :postCode 
            WHERE branchno = :branchNo`,
            {
                street: street,
                city: city,
                postCode: postCode,
                branchNo: branchNo
            },
            {
                autoCommit: true // Automatically commit the transaction
            }
        );

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Branch ${branchNo} was successfully edited.`}, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest) {
    const { branchNo } = await req.json();

    try {
        // create connection to the db
        const connection = await dbConn();


        await connection.execute(`DELETE FROM DH_BRANCH WHERE branchno = :branchNo`,
            {
                branchNo: branchNo
            },
            {
                autoCommit: true // Automatically commit the transaction
            }
        );

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Branch ${branchNo} was successfully deleted.`}, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}