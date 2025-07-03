------------ Basic SQL Queries ------------ 

--- Total Number of Clients
SELECT COUNT(*) AS total_clients
FROM DH_Client;

--- Client Count by Preferred Property Type
SELECT preftype AS preferred_type, COUNT(*) AS client_count
FROM DH_Client
GROUP BY preftype;

-------- Budget Distribution --------
--- Client Budget Ranges
SELECT
  CASE
    WHEN maxrent <= 400 THEN '≤ $400'
    WHEN maxrent <= 600 THEN '$401–$600'
    WHEN maxrent <= 800 THEN '$601–$800'
    ELSE '> $800'
  END AS budget_range,
  COUNT(*) AS client_count
FROM DH_Client
GROUP BY
  CASE
    WHEN maxrent <= 400 THEN '≤ $400'
    WHEN maxrent <= 600 THEN '$401–$600'
    WHEN maxrent <= 800 THEN '$601–$800'
    ELSE '> $800'
  END;


--- Average, Min, Max Budget (For Summary Stats)
SELECT
  AVG(maxrent) AS average_budget,
  MIN(maxrent) AS min_budget,
  MAX(maxrent) AS max_budget
FROM DH_Client;


--- Clients by City (Optional Geo Insights)
SELECT city, COUNT(*) AS client_count
FROM DH_Client
GROUP BY city;


------------ MODERATE BUSINESS REQUIREMENTS ------------ 
--- Constraints & Data Integrity
-- These help enforce business rules and prevent bad data.
ALTER TABLE DH_Client
ADD CONSTRAINT chk_maxrent_positive CHECK (maxrent > 0);

ALTER TABLE DH_Staff
ADD CONSTRAINT chk_salary_range CHECK (salary BETWEEN 5000 AND 50000);



--- Views for Reporting
--Reusable read-only datasets for dashboards or reporting tools.
-- Clients who prefer houses and have a high budget
CREATE OR REPLACE VIEW DH_HighBudgetClients AS
SELECT clientno, fname, lname, maxrent
FROM DH_Client
WHERE preftype = 'House' AND maxrent > 700;

--- Aggregations for Insight
-- Reports on leasing trends, staff performance, etc.
-- Number of properties handled per staff
SELECT staffno, COUNT(*) AS num_properties
FROM DH_PropertyForRent
GROUP BY staffno;


--- Update/Delete with Conditions
-- For data corrections or operational cleanup.
UPDATE DH_Client
SET city = 'London'
WHERE clientno = 'CR55';

DELETE FROM DH_Lease
WHERE lease_end < SYSDATE; -- remove old leases


------------ADVANCED BUSINESS REQUIREMENTS ------------ 
--- Stored Procedures & Packages
-- Automate complex logic (e.g., calculate commission, generate lease summary).
CREATE OR REPLACE PROCEDURE update_lease_end (
    p_leaseNo IN NUMBER,
    p_newEndDate IN DATE
) AS
BEGIN
  UPDATE DH_Lease
  SET lease_end = p_newEndDate
  WHERE leaseNo = p_leaseNo;
END;


--- Triggers
-- Auto-run logic on insert/update/delete (e.g., audit log, status updates).
CREATE OR REPLACE TRIGGER trg_property_insert
AFTER INSERT ON DH_PropertyForRent
FOR EACH ROW
BEGIN
  INSERT INTO DH_AuditLog(tableName, operationType, recordID, performedBy)
  VALUES ('DH_PropertyForRent', 'INSERT', :NEW.propertyno, 'system');
END;


--- Materialized Views
-- For performance when querying large data (e.g., summaries).
CREATE MATERIALIZED VIEW mv_city_property_count
REFRESH FAST ON COMMIT
AS
SELECT city, COUNT(*) AS property_count
FROM DH_PropertyForRent
GROUP BY city;


--- Roles & Permissions
-- Control access for staff/admin/clients (important in production).
CREATE ROLE client_user;
GRANT SELECT ON DH_PropertyForRent TO client_user;
GRANT SELECT, INSERT ON DH_Viewing TO client_user;

GRANT client_user TO alice; -- user "alice" is now a client


--- Advanced Analytics Queries
-- Find average rent by property type and city
SELECT type, city, AVG(rent) AS avg_rent
FROM DH_PropertyForRent
GROUP BY type, city;


--- Clients without any viewings
SELECT c.clientno, c.fname, c.lname
FROM DH_Client c
LEFT JOIN DH_Viewing v ON c.clientno = v.clientno
WHERE v.clientno IS NULL;




