const oracledb = require('oracledb');

export default async function GET(req: any, res: any) {
  try {
     const connection = await oracledb.getConnection({
        user: "COMP214_M24_ers_41",
        password: "password",
        connectString: "199.212.26.208:1521:SQLD",
    });

    const result = await connection.execute("SELECT * FROM BB_BASKET");
    await connection.close();

    res.status(200).json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}