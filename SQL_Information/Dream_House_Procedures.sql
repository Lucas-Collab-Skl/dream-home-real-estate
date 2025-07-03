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

