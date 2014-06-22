CREATE PROCEDURE USER_ADD(OUT P_ID INT,
                          IN P_NAME D_VC,
                          IN P_LOGIN D_VC,
                          IN P_PWD D_VC,
                          IN P_COMMENT D_VC_LONG,
                          IN P_ADMIN BOOLEAN,
                          IN P_LOCKED BOOLEAN) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

INSERT INTO USERS(ID,NAME,LOGIN,PWD,COMMENT,LOCKED) 
VALUES(DEFAULT,P_NAME,P_LOGIN,P_PWD,P_COMMENT,P_LOCKED);

SET P_ID = IDENTITY();

INSERT INTO USER_ROLES(LOGIN, ROLE) 
VALUES(P_LOGIN,CASEWHEN(P_ADMIN,'admin','user'));

END




DROP PROCEDURE USER_ADD




