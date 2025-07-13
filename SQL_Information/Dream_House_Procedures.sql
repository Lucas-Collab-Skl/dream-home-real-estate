--- Automate report generation or cleanup.
BEGIN
  DBMS_SCHEDULER.create_job (
    job_name        => 'auto_clean_expired_leases',
    job_type        => 'PLSQL_BLOCK',
    job_action      => 'BEGIN DELETE FROM DH_LEASE WHERE lease_end < SYSDATE; END;',
    start_date      => SYSTIMESTAMP,
    repeat_interval => 'FREQ=DAILY',
    enabled         => TRUE
  );
END;



-- STAFF_HIRE_SP --
create or replace PROCEDURE STAFF_HIRE_SP 
(
  s_firstname IN VARCHAR2,
  s_lastname IN VARCHAR2,
  s_position IN VARCHAR2,
  s_DOB IN DATE,
  s_salary IN NUMBER,
  s_branchNo IN VARCHAR2,
  s_telephone IN VARCHAR2,
  s_mobile IN VARCHAR2,
  s_email IN VARCHAR2,
  out_staffNo OUT VARCHAR2
) AS 
BEGIN
  INSERT INTO DH_STAFF(staffno, fname, lname, position, dob, salary, branchNo, telephone, mobile, email) 
  VALUES(staffno_seq.NEXTVAL, s_firstname, s_lastname, s_position, s_DOB, s_salary, s_branchNo, s_telephone, s_mobile, s_email)
  RETURNING staffno INTO out_staffNo;
  
  COMMIT;
  
END STAFF_HIRE_SP;



-- USER_CREATE_SP -- 
create or replace PROCEDURE USER_CREATE_SP 
(
    u_staffNo IN VARCHAR2,
    u_username IN VARCHAR2,
    u_password_hash IN VARCHAR2,
    u_role IN VARCHAR2
) AS 
BEGIN
    INSERT INTO DH_USERACCOUNT (userid, username, password, role, status, staffNo)
    VALUES (userid_seq.NEXTVAL, u_username, u_password_hash, u_role, 'active', u_staffNo);
    COMMIT;
    
END USER_CREATE_SP;



-- AUTH_USER_SP --
CREATE OR REPLACE PROCEDURE AUTH_USER_SP (
    u_username IN VARCHAR2,
    u_password_hash IN VARCHAR2,
    u_valid OUT NUMBER
)AS 
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM DH_USERACCOUNT WHERE username = u_username AND password = u_password_hash;
    
    IF v_count > 0 THEN
        u_valid := 1;
    ELSE
        u_valid := 0;
    END IF;
    
END AUTH_USER_SP;


-------- Task 2-1    Get Branch Address    ---------------------
CREATE OR REPLACE FUNCTION get_branch_address (
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
END get_branch_address;
/

----- Using Function get_branch_address hardcoded address branch 
DECLARE
    v_address VARCHAR2(255);
BEGIN
    v_address := get_branch_address('B002');
    DBMS_OUTPUT.PUT_LINE('Branch B002 Address: ' || v_address);
END;
/



SET SERVEROUTPUT ON;

----- Using Function get_branch_address from user input
ACCEPT p_branchno CHAR PROMPT 'Enter Branch Number (e.g., B002): '

DECLARE
    v_branch_full_address VARCHAR2(255);
BEGIN
    v_branch_full_address := get_branch_address('&p_branchno');
    DBMS_OUTPUT.PUT_LINE('Address for Branch &p_branchno: ' || v_branch_full_address);
END;
/


-------- Task 2-2  - Allow end user to change BRANCH ADDRESS   ---------------------
--- Create Stored Procedure in Oracle

CCREATE OR REPLACE PROCEDURE update_branch_address (
    p_branchno        IN DH_Branch.Branchno%TYPE,
    p_new_street      IN DH_Branch.street%TYPE,
    p_new_city        IN DH_Branch.city%TYPE,
    p_new_postcode    IN DH_Branch.Postcode%TYPE
)
IS
    v_rows_updated NUMBER;
BEGIN
    UPDATE DH_Branch
    SET
        street = p_new_street,
        city = p_new_city,
        Postcode = p_new_postcode
    WHERE
        Branchno = p_branchno;

    v_rows_updated := SQL%ROWCOUNT;
    COMMIT;

    IF v_rows_updated > 0 THEN
        DBMS_OUTPUT.PUT_LINE('Branch ' || p_branchno || ' address updated successfully.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Branch ' || p_branchno || ' not found or no changes made.');
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An unexpected error occurred: ' || SQLERRM);
        ROLLBACK;
END update_branch_address;
/


----- Using Function get_branch_address hardcoded address branch 
SET SERVEROUTPUT ON;

DECLARE
    -- Declare local variables to hold the parameters for clarity
    v_branchno        DH_Branch.Branchno%TYPE := 'B004';
    v_new_street      DH_Branch.street%TYPE   := '35 Raven Street';
    v_new_city        DH_Branch.city%TYPE     := 'London';
    v_new_postcode    DH_Branch.Postcode%TYPE := 'NW10 6RE';  -- Add a valid postcode
BEGIN
    -- Invoke the stored procedure, passing the required parameters
    update_branch_address(v_branchno, v_new_street, v_new_city, v_new_postcode);
END;
/


-- run a stored procedure directly, without
EXECUTE update_branch_address('B004', '37 Raven Street', 'London', 'NW10 6RE');



-------- Task 2-3  - Allow end user to change BRANCH ADDRESS   ---------------------
-- Create or replace the stored procedure
CREATE OR REPLACE PROCEDURE new_branch (
    p_branchno   IN DH_Branch.Branchno%TYPE,
    p_street     IN DH_Branch.street%TYPE,
    p_city       IN DH_Branch.city%TYPE,
    p_postcode   IN DH_Branch.postcode%TYPE
)
IS
    -- Scalar variables are not explicitly needed if directly using parameters in the INSERT statement,
    -- but they could be declared here if intermediate processing was required.
BEGIN
    -- Insert new branch details into the DH_Branch table
    INSERT INTO DH_Branch (Branchno, street, city, postcode)
    VALUES (p_branchno, p_street, p_city, p_postcode);

    -- Make the changes permanent in the database
    COMMIT; -- This ensures the insert is saved permanently [Your Query]

    -- Provide feedback (requires SET SERVEROUTPUT ON)
    DBMS_OUTPUT.PUT_LINE('New Branch ' || p_branchno || ' added successfully.');

EXCEPTION
    -- Basic exception handling
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: Branch number ' || p_branchno || ' already exists.');
        ROLLBACK; -- Rollback in case of duplicate entry
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An unexpected error occurred: ' || SQLERRM);
        ROLLBACK; -- Rollback any changes in case of other errors
END new_branch;
/

-- Test Add New Branch

BEGIN
    new_branch('B007', '45 Green Lane', 'Leeds', 'LS1 2AB');
END;
/





-------- Task 3.2 – Create a web Form to update client   ---------------------
CREATE OR REPLACE PROCEDURE update_client_info (
    p_clientno   IN DH_Client.Clientno%TYPE,
    p_maxrent    IN DH_Client.maxrent%TYPE    DEFAULT NULL,
    p_telno      IN DH_Client.telno%TYPE      DEFAULT NULL,
    p_email      IN DH_Client.email%TYPE      DEFAULT NULL
)
IS
    v_client_count NUMBER;
BEGIN
    -- Check if the client number exists
    SELECT COUNT(*)
    INTO v_client_count
    FROM DH_Client
    WHERE Clientno = p_clientno;

    IF v_client_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: Client number ' || p_clientno || ' does not exist.');
        RETURN;
    END IF;

    -- Update DH_Client table with new values
    UPDATE DH_Client
    SET
        maxrent = NVL(p_maxrent, maxrent),
        telno   = NVL(p_telno, telno),
        email   = NVL(p_email, email)
    WHERE
        Clientno = p_clientno;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE('Client ' || p_clientno || ' updated successfully.');

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An unexpected error occurred: ' || SQLERRM);
        ROLLBACK;
END update_client_info;
/


--- Update Client Execute Function:
EXEC update_client_info('CR55', NULL, '07700 900123', 'brucie@wayne.com');

--- Update Client
BEGIN
    update_client_info(
        p_clientno => 'CR56',
        p_maxrent  => 500,
        p_telno    => '01234567890',
        p_email    => 'fred.flintstone.new@bedrock.com'
    );
END;
/

---------