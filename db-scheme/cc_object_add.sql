CREATE PROCEDURE CC_OBJECT_ADD(OUT P_ID INT,
                                IN P_MAP_ID INT, 
                                IN P_NAME D_VC,
                                IN P_COMMENT D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

INSERT INTO CC_OBJECTS(ID, NAME, COMMENT, MAP_ID)
VALUES(DEFAULT,P_NAME,P_COMMENT,P_MAP_ID);

SET P_ID = IDENTITY();

END


DROP PROCEDURE CC_OBJECT_ADD







