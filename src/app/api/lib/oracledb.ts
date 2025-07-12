    const oracledb = require('oracledb');
export default async function dbConn() {
   const connection = await oracledb.getConnection({
           user: "COMP214_M24_ers_41",
           password: "password",
           connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=199.212.26.208)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=SQLD)))",
       });

    return connection;
}
