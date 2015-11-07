CREATE PROCEDURE PM_PORT_UPDATE(
  IN P_ID INT,
	IN P_PORT D_VC,
  IN P_COMMENT D_VC_LONG,
  IN P_TELCO D_VC,
  IN P_PATCH D_VC,
  IN P_LOCATION D_VC_LONG)
  
MODIFIES SQL DATA 
BEGIN ATOMIC 

UPDATE PM_PORTS
  SET PORT = P_PORT,
  		COMMENT = P_COMMENT,
    	TELCO = P_TELCO,
      PATCH = P_PATCH,
      LOCATION = P_LOCATION
WHERE ID = P_ID;

IF DIAGNOSTICS(ROW_COUNT) = 0 THEN
  SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'NO_DATA_FOUND';
END IF;

END




DROP PROCEDURE PM_PORT_UPDATE



