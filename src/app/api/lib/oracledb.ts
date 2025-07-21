const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs');

export default async function dbConn() {
    try {
        // Check if wallet files exist
        const walletPath = path.join(process.cwd(), 'wallet');
        const tnsNamesPath = path.join(walletPath, 'tnsnames.ora');
        const walletExists = fs.existsSync(tnsNamesPath);

        let connectionConfig;

        if (walletExists && process.env.USE_WALLET === 'true') {
            console.log('Using wallet-based connection with Thin mode...');
            
            // use wallet files directly in connection config for Thin mode
            
            connectionConfig = {
                user: process.env.NEXT_PUBLIC_DB_USER,
                password: process.env.NEXT_PUBLIC_DB_PASSWORD,
                connectString: process.env.NEXT_PUBLIC_DB_SERVICE_NAME || "dreamhome_low",
                configDir: walletPath,
                walletLocation: walletPath,
                walletPassword: process.env.WALLET_PASSWORD || '',
            };
        } else {
            console.log('Using direct connection string...');
            
            connectionConfig = {
                user: process.env.NEXT_PUBLIC_DB_USER,
                password: process.env.NEXT_PUBLIC_DB_PASSWORD,
                connectString: process.env.NEXT_PUBLIC_DB_CONNECTION_STRING,
            };
        }

        const connection = await oracledb.getConnection(connectionConfig);
        console.log('Oracle DB connection successful');
        return connection;
        
    } catch (error) {
        console.error('Error connecting to Oracle DB:', error);
        throw error;
    }
}