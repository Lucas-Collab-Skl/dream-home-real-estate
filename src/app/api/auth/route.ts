import { NextRequest, NextResponse } from "next/server";
import oracledb from "oracledb";
import dbConn from "../lib/oracledb";
import crypto from "crypto";

export async function PUT(req: NextRequest) {
    const formData = await req.formData();
    const staffNo = formData.get('staffNo') as string;
    const photoFile = formData.get('photo') as File;

    if (!staffNo || !photoFile) {
        return NextResponse.json({ error: "Staff number and photo are required" }, { status: 400 });
    }

    try {
        // Compress/resize image before converting to base64
        const arrayBuffer = await photoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Log original size
        console.log("Original file size:", buffer.length, "bytes");
        
        const base64String = buffer.toString('base64');
        const dataUrl = `data:${photoFile.type};base64,${base64String}`;
        
        console.log("Base64 string length:", dataUrl.length);

        const connection = await dbConn();
        
        // Use CLOB for large base64 strings
        await connection.execute(
            `UPDATE DH_USERACCOUNT SET PHOTO = :photo WHERE STAFFNO = :staffNo`,
            {
                staffNo: staffNo,
                photo: { val: dataUrl, type: oracledb.CLOB }
            },
            { autoCommit: true }
        );

        await connection.close();

        return NextResponse.json({ 
            message: "Profile photo updated successfully",
            photo: dataUrl
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating profile photo:", error);
        return NextResponse.json({ error: "Failed to update profile photo" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const staffNo = url.searchParams.get('staffNo');

        if (!staffNo) {
            return NextResponse.json({ error: "Staff number is required" }, { status: 400 });
        }

        const connection = await dbConn();
        
        // Retrieve CLOB data
        const result = await connection.execute(
            `SELECT PHOTO FROM DH_USERACCOUNT WHERE STAFFNO = :staffNo`,
            { staffNo: staffNo },
        );

        console.log("Retrieved photo data:", result.rows);

        if (result.rows && result.rows.length > 0 && result.rows[0][0]) {
            let photoDataUrl = result.rows[0][0];
            
            // Handle CLOB object if returned
            if (typeof photoDataUrl === 'object' && photoDataUrl.getData) {
                photoDataUrl = await photoDataUrl.getData();
            }

            await connection.close();
            
            return NextResponse.json({ 
                photo: photoDataUrl as string,
                message: "Photo retrieved successfully"
            }, { status: 200 });
        } else {
            return NextResponse.json({ error: "No photo found" }, { status: 404 });
        }

    } catch (error) {
        console.error("Error retrieving profile photo:", error);
        return NextResponse.json({ error: "Failed to retrieve profile photo" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
    const { username, password } = await req.json();

    const password_hash = crypto.createHash('sha256').update(password + process.env.NEXT_PUBLIC_SALT).digest('hex');

    console.log("Username:", username);
    console.log("Hashed Password:", password_hash);

    console.log("IP Address:", ip);

    // pass the username and hashed password to the database for authentication
    const connection = await dbConn();

    const authUser = await connection.execute(`BEGIN AUTH_USER_SP(:username, :password, :valid, :staffNo, :photo); END;`, {
        username: username,
        password: password_hash,
        valid: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
        staffNo: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
        photo: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_CLOB }
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

        let photoDataUrl = null;
         if (typeof authUser.outBinds.photo === 'object' && authUser.outBinds.photo != null) {
                photoDataUrl = await authUser.outBinds.photo.getData();
            }

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
                email: userProfile.rows[0][10] as string,
                photo: photoDataUrl
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