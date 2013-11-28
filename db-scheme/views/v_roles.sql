create view v_roles as
WITH x(id,role) AS (VALUES(1,'admin'),(2,'user')) 
SELECT id, trim(role) as role FROM x


drop view v_roles

SELECT * FROM v_roles

