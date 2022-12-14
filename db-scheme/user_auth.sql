CREATE PROCEDURE USER_AUTH(IN P_USER D_VC) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

DECLARE L_USER_ID INTEGER;
SET L_USER_ID = (SELECT ID FROM V_ACTIVE_USERS WHERE LOGIN = P_USER);

IF L_USER_ID IS NULL THEN
  SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'AUTH_ERROR';
END IF;

CALL SES_VAR_SET('USER_ID',CAST(L_USER_ID AS D_VC));
END




DROP PROCEDURE USER_AUTH
