import { NextRequest, NextResponse } from "next/server";
import dbConn from "@/app/api/lib/oracledb";
import oracledb from "oracledb";

export async function POST(req: NextRequest) {
    const { firstName, lastName, telephone, street, city, email, preferredType, maxRent } = await req.json();

    // clean max rent, remove commans and convert to number.
    const cleanMaxRent = maxRent.toString().replace(/,/g, '');
    const maxRentNum = parseFloat(cleanMaxRent);


    try {
        // create connection to the db
        const connection = await dbConn();

        // insert into DH_CLIENT
        const insertClient = await connection.execute(`BEGIN CLIENT_CREATE_SP 
            (:firstName, :lastName, :telephone, :street, :city, :email, :preferredType, :maxRent, :clientNo); 
            END;`, {
            firstName: firstName,
            lastName: lastName,
            telephone: telephone,
            street: street,
            city: city,
            email: email,
            preferredType: preferredType,
            maxRent: maxRentNum,
            clientNo: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        });

        // log for debugging purposes
        console.log('New ClientNo:', insertClient.outBinds.clientNo);

        const clientNo = await insertClient.outBinds.clientNo;

        // close the connection
        await connection.close();

        return NextResponse.json({ message: `Staff member (${clientNo}) ${firstName} ${lastName} was successfully registered.` }, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}
