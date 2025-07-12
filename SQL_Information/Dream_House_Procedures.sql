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