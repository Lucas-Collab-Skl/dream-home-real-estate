import { NextRequest, NextResponse } from "next/server";
import oracledb from "oracledb";
import dbConn from "../lib/oracledb";
import crypto from "crypto";


export async function POST(req: NextRequest) {
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
    const { username, password } = await req.json();

     const password_hash = crypto.createHash('sha256').update(password + 'scoobydoobydooSalt').digest('hex');

    console.log("Username:", username);
    console.log("Hashed Password:", password_hash);

    console.log("IP Address:", ip);

    // pass the username and hashed password to the database for authentication
    const connection = await dbConn();

    const authUser = await connection.execute(`BEGIN AUTH_USER_SP(:username, :password, :valid, :staffNo); END;`, {
        username: username,
        password: password_hash,
        valid: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
        staffNo: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
    });

    
    const valid = authUser.outBinds.valid;
    // check response, boolean true if authenticated, false if not
    console.log("Authentication response:", valid);

    if (valid == 1) {
        // if authenticated, get profile from DH_Staff,
        // set row to user context
        console.log("User authenticated with staffNo:", authUser.outBinds.staffNo);

        const userProfile = await connection.execute(`SELECT * FROM DH_STAFF WHERE STAFFNO = :staffNo AND ROWNUM=1`, {
            staffNo: authUser.outBinds.staffNo
        });

        await connection.close();

        return NextResponse.json({
            message: "User authenticated",
            profile: {
                staffNo: userProfile.rows[0][0] as string,
                firstName: userProfile.rows[0][1] as string,
                lastName: userProfile.rows[0][2] as string,
                position: userProfile.rows[0][3] as string,
                sex: userProfile.rows[0][4] as string,
                DOB: userProfile.rows[0][5] as string,
                salary: userProfile.rows[0][6] as number,
                branchNo: userProfile.rows[0][7] as string,
                telephone: userProfile.rows[0][8] as string,
                mobile: userProfile.rows[0][9] as string,
                email: userProfile.rows[0][10] as string
            }}, { status: 200 });

        // TODO: log user in DH_Login_History

        // TODO: log user in DH_Login_History

        // TODO: log user in DH_Login_History

        // TODO: log user in DH_Login_History

    } else {
        await connection.close();
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

}