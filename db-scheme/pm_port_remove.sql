CREATE PROCEDURE PM_PORT_REMOVE(IN P_ID INT)  
MODIFIES SQL DATA 
BEGIN ATOMIC 
DELETE FROM PM_PORT_CLIENTS WHERE PM_PORT_ID = P_ID;
DELETE FROM PM_PORTS WHERE ID = P_ID;
END




DROP PROCEDURE PM_PORT_REMOVE



