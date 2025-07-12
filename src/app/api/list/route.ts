import { NextRequest, NextResponse } from "next/server";
import { Branch, Property, Staff } from "@/app/types";
import dbConn from "../lib/oracledb";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const table = searchParams.get("table");
    let dbTable;

    const tableNames = ["property", "branch", "staff", "client"];

    if (!table && !tableNames.includes(table ? table : "")) {
        return NextResponse.json({ error: "Table name is required" }, { status: 400 });
    }

    if (table == "property") {
        dbTable = "DH_PROPERTYFORRENT";
    } else if (table == "branch") {
        dbTable = "DH_BRANCH";
    } else if (table == "staff") {
        dbTable = "DH_STAFF";
    } else if (table == "client") {
        dbTable = "DH_CLIENT";
    }

    try {
        const connection = await dbConn();

        const result = await connection.execute(`SELECT * FROM ${dbTable}`);
        await connection.close();

        const tableList = result.rows?.map((row: any) => {
            if (table === "property") {
                const property: Property = {
                    propertyNo: row[0] as string,
                    street: row[1] as string,
                    city: row[2] as string,
                    postalCode: row[3] as string,
                    type: row[4] as string,
                    rooms: row[5] as number,
                    rent: row[6] as number,
                    ownerNo: row[7] as string,
                    staffNo: row[8] as string,
                    branchNo: row[9] as string,
                    picture: row[10] as string,
                    floorplan: row[11] as string
                };
                return property;
                
            } else if (table === "staff") {
                const staff: Staff = {
                    staffNo: row[0] as string,
                    firstName: row[1] as string,
                    lastName: row[2] as string,
                    position: row[3] as string,
                    sex: row[4] as string, 
                    DOB: row[5],
                    salary: row[6] as number,
                    branchNo: row[7] as string,
                    telephone: row[8] as string,
                    mobile: row[9] as string,
                    email: row[10] as string
                };
                return staff;
            } else if (table == "branch") {
                const branch: Branch = {
                    branchNo: row[0] as string,
                    street: row[1] as string,
                    city: row[2] as string,
                    postCode: row[3] as string
                };
                return branch;
            }

            return row;
        });
        

        return NextResponse.json({ tableList: tableList }, { status: 200 });
    } catch (err: any) {
        console.error("Error connecting to Oracle Database:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}