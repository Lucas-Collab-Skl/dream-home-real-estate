# Dream Home Real Estate
Lucas Vandermaarel
Ayan Musse

## Hosted at
[Dreamhome](https://dreamhome.vanderloch.com)


## Tech Stack
+ Frontend & Backend - [Next.JS](https://nextjs.org/)
+ UI Framework - [TailwindCSS](https://tailwindcss.com/) & [HeroUI Components](https://www.heroui.com/)
+ DBMS - [Oracle SQL Developer](https://www.oracle.com/ca-en/database/sqldeveloper/) -> [Oracle Autonomous DB](https://www.oracle.com/ca-en/autonomous-database/)

## Getting Started

In order to run the program, you will need a few tables created, some procedures, a function, and sequences.
__These can all be found under SQL_USED.sql__

Then you would need to create a `DH_BRANCH` record with sql as well as a `DH_STAFF` Record and `DH_USERACCOUNT` record.
The staff and user account can be created by ... *Hard coding it in the staff route.* (src/app/api/staff/route.ts)

You can uncomment out the code that is already there:
```ts
/*let firstName = "User";
let lastName = "LastName";
let position = "CEO";
let DOB = new Date("2000-02-03");
let salary = 100000;
let branchNo = "B002"; // change to the branchNo you creating in DH_BRANCH
let telephone = "1234567890";
let mobile = "2261234567";
let email = "hello@gmail.com";
let username = "user";
let password = "pass123";
let createUser = true;
*/
```

 and comment out the first line in the POST function:
 ```
 const { firstName, lastName, position, DOB, salary, branchNo, telephone, mobile, email, username, password, createUser } = await req.json();

 ```

### Clone the project to your local machine.

To run, you would need to create a .env file and put it into the root of your project first:

```bash
# The salt that you put onto your hashed passwords
NEXT_PUBLIC_SALT

# You set this in Oracle Autonomous DB
WALLET_PASSWORD

# Database credentials. Refer to Oracle Autonomous DB connection documentation.

NEXT_PUBLIC_DB_USER
NEXT_PUBLIC_DB_PASSWORD
NEXT_PUBLIC_DB_CONNECTION_STRING
NEXT_PUBLIC_DB_SERVICE_NAME

# Wallet files converted into base64. Gotten from Oracle Autonomous DB connection

WALLET_TNSNAMES_ORA
WALLET_SQLNET_ORA
WALLET_CWALLET_SSO
WALLET_EWALLET_P12
WALLET_KEYSTORE_JKS
WALLET_TRUSTSTORE_JKS
WALLET_EWALLET_PEM

```

## Once cloned and .env is created and configured with your autonomous DB information. Run:

```bash
# installs all packages
npm install

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web app running!



