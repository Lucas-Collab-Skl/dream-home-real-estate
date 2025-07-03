import oracledb from "oracledb";
import {NextRequest, NextResponse} from "next/server";
import { Property } from "@/app/types";

export async function GET(req: NextRequest, res: any) {
  const { searchParams } = req.nextUrl;
  const table = searchParams.get("table");
  let dbTable;

  const tableNames = ["property", "branch", "staff", "client"];

  if(!table && !tableNames.includes(table ? table : "")) {
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
     const connection = await oracledb.getConnection({
        user: "COMP214_M24_ers_41",
        password: "password",
        connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=199.212.26.208)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=SQLD)))",
    });

    const result = await connection.execute(`SELECT * FROM ${dbTable}`);
    await connection.close();

    const properties = result.rows?.map((row: any) => {
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
      }
      return row;
    });

     return NextResponse.json({ properties: properties }, { status: 200 });
  } catch (err: any) {
    console.error("Error connecting to Oracle Database:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}