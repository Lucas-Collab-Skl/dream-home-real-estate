-- Tables 

-- ALL DH_ tables from Centennial College --

-- And then in addition:
--  DH_UserAccount
CREATE TABLE DH_UserAccount (
    userID VARCHAR2(50) PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(100) NOT NULL, -- hashed password
    role VARCHAR2(20) NOT NULL CHECK (role IN ('client', 'staff', 'owner', 'admin')),
    status VARCHAR2(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    staffNo VARCHAR2(50),
    photo CLOB,
    CONSTRAINT fk_user_staff FOREIGN KEY (staffNo) REFERENCES DH_Staff(staffNo)
);
COMMIT;
-- end of tables


-- Procedures and functions

-- To Authorize the user
create or replace PROCEDURE AUTH_USER_SP (
    u_username IN VARCHAR2,
    u_password_hash IN VARCHAR2,
    u_valid OUT NUMBER,
    u_staffNo OUT DH_USERACCOUNT.staffNo%TYPE
)AS 
    v_count NUMBER;
BEGIN
    SELECT staffNo
      INTO u_staffNo
      FROM DH_USERACCOUNT
     WHERE username = u_username
       AND password = u_password_hash
       AND ROWNUM = 1;
       
       u_valid := 1;
       
EXCEPTION WHEN NO_DATA_FOUND THEN
        u_valid := 0;
        u_staffNo := NULL;
    
END AUTH_USER_SP;


-- To create a new staff member
create or replace PROCEDURE STAFF_HIRE_SP 
(
  s_firstname IN DH_STAFF.fname%TYPE,
  s_lastname IN DH_STAFF.lname%TYPE,
  s_position IN DH_STAFF.position%TYPE,
  s_DOB IN DH_STAFF.dob%TYPE,
  s_salary IN DH_STAFF.salary%TYPE,
  s_branchNo IN DH_STAFF.branchNo%TYPE,
  s_telephone IN DH_STAFF.telephone%TYPE,
  s_mobile IN DH_STAFF.mobile%TYPE,
  s_email IN DH_STAFF.email%TYPE,
  out_staffNo OUT DH_STAFF.staffno%TYPE
) AS 
BEGIN

  INSERT INTO DH_STAFF(staffno, fname, lname, position, dob, salary, branchNo, telephone, mobile, email) 
  VALUES(staffno_seq.NEXTVAL, s_firstname, s_lastname, s_position, s_DOB, s_salary, s_branchNo, s_telephone, s_mobile, s_email)
  RETURNING staffno INTO out_staffNo;
  
  COMMIT;
  
END STAFF_HIRE_SP;



-- To create a new user account
create or replace PROCEDURE USER_CREATE_SP 
(
    u_staffNo IN DH_USERACCOUNT.staffNo%TYPE,
    u_username IN DH_USERACCOUNT.username%TYPE,
    u_password_hash IN DH_USERACCOUNT.password%TYPE,
    u_role IN DH_USERACCOUNT.role%TYPE
) AS 
BEGIN
    INSERT INTO DH_USERACCOUNT (userid, username, password, role, status, staffNo)
    VALUES (userid_seq.NEXTVAL, u_username, u_password_hash, u_role, 'active', u_staffNo);
    COMMIT;
    
END USER_CREATE_SP;


-- To create a new branch
create or replace PROCEDURE NEW_BRANCH (
    p_branchno   IN DH_Branch.branchno%TYPE,
    p_street     IN DH_Branch.street%TYPE,
    p_city       IN DH_Branch.city%TYPE,
    p_postcode   IN DH_Branch.postcode%TYPE
)
IS
BEGIN
    INSERT INTO DH_Branch (branchno, street, city, postcode)
    VALUES (p_branchno, p_street, p_city, p_postcode);
    
    COMMIT;

EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20005, 'Branch ' || p_branchno || ' already exists (unique constraint violation)');
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE_APPLICATION_ERROR(-20999, 'Error creating branch: ' || SQLERRM);
END NEW_BRANCH;


-- To create a new client
create or replace PROCEDURE CLIENT_CREATE_SP 
(
  c_firstname IN DH_CLIENT.fname%TYPE,
  c_lastname IN DH_CLIENT.lname%TYPE,
  c_telephone IN DH_CLIENT.telno%TYPE,
  c_street IN DH_CLIENT.street%TYPE,
  c_city IN DH_CLIENT.city%TYPE,
  c_email IN DH_CLIENT.email%TYPE,
  c_preferredType IN DH_CLIENT.preftype%TYPE,
  c_maxRent IN DH_CLIENT.maxrent%TYPE,
  out_clientNo OUT DH_CLIENT.clientno%TYPE
) AS 
BEGIN

  INSERT INTO DH_CLIENT(clientno, fname, lname, telno, street, city, email, preftype, maxrent) 
  VALUES(clientno_seq.NEXTVAL, c_firstname, c_lastname, c_telephone, c_street, c_city, c_email, c_preferredType, c_maxRent)
  RETURNING clientno INTO out_clientNo;
  
  COMMIT;
  
END CLIENT_CREATE_SP;


-- Function to get branch address off of branch number
create or replace FUNCTION GET_BRANCH_ADDRESS (
    p_branchno IN DH_Branch.Branchno%TYPE
) RETURN VARCHAR2 IS
    v_full_address VARCHAR2(255);
BEGIN
    SELECT street || ', ' || city
    INTO v_full_address
    FROM DH_Branch
    WHERE Branchno = p_branchno;

    RETURN v_full_address;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'Branch Not Found';
    WHEN TOO_MANY_ROWS THEN
        RETURN 'Error: Multiple Branches Found';
END GET_BRANCH_ADDRESS;


-- end of procedures and functions




-- sequences

-- use with userid in DH_UserAccount
CREATE SEQUENCE userid_seq
  START WITH 0
  INCREMENT BY 1
  MINVALUE 0
  NOCACHE
  NOCYCLE;

-- use with staffno in DH_Staff
  CREATE SEQUENCE staffno_seq
  START WITH 0
  INCREMENT BY 1
  MINVALUE 0
  NOCACHE
  NOCYCLE;

-- use with clientno in DH_Client
CREATE SEQUENCE clientno_seq
  START WITH 0
  INCREMENT BY 1
  MINVALUE 0
  NOCACHE
  NOCYCLE;


  -- end of sequences