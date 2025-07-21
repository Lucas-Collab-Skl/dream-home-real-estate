const oracledb = require('oracledb');
const path = require('path');
const fs = require('fs');

export default async function dbConn() {
    try {
        // Check if wallet files exist
        
            console.log('Using wallet-based connection with Thin mode...');
            
            const tempWalletPath = path.join('/tmp', 'wallet');

            const walletFiles = {
                'tnsnames.ora': process.env.WALLET_TNSNAMES_ORA,
                'sqlnet.ora': process.env.WALLET_SQLNET_ORA,
                'cwallet.sso': process.env.WALLET_CWALLET_SSO,
                'ewallet.p12': process.env.WALLET_EWALLET_P12,
                'keystore.jks': process.env.WALLET_KEYSTORE_JKS,
                'truststore.jks': process.env.WALLET_TRUSTSTORE_JKS
            };

            Object.entries(walletFiles).forEach(([filename, base64Content]) => {
                if (base64Content) {
                    const filePath = path.join(tempWalletPath, filename);
                    const buffer = Buffer.from(base64Content, 'base64');
                    fs.writeFileSync(filePath, buffer);
                    console.log(`Created wallet file: ${filename}`);
                }
            });
            
            const connectionConfig = {
                user: process.env.NEXT_PUBLIC_DB_USER,
                password: process.env.NEXT_PUBLIC_DB_PASSWORD,
                connectString: process.env.NEXT_PUBLIC_DB_SERVICE_NAME || "dreamhome_low",
                configDir: tempWalletPath,
                walletLocation: tempWalletPath,
                walletPassword: process.env.WALLET_PASSWORD || '',
            };

        const connection = await oracledb.getConnection(connectionConfig);
        console.log('Oracle DB connection successful');
        return connection;
        
    } catch (error) {
        console.error('Error connecting to Oracle DB:', error);
        throw error;
    }
}