CREATE PROCEDURE PM_OBJECT_UPDATE(IN P_ID INT,
	                                IN P_NAME D_VC,
                                  IN P_COMMENT D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

UPDATE PM_OBJECTS
   SET NAME = P_NAME,
       COMMENT = P_COMMENT
 WHERE ID = P_ID;

IF DIAGNOSTICS(ROW_COUNT) = 0 THEN
  SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'NO_DATA_FOUND';
END IF;

END


DROP PROCEDURE PM_OBJECT_UPDATE









