CREATE PROCEDURE CC_DEVICE_ADD(OUT P_ID INT,
                                IN P_HOST D_VC,
                                IN P_LOGIN D_VC,
                                IN P_PWD D_VC,
                                IN P_ENABLE_PWD D_VC,
                                IN P_NAME D_VC,
                                IN P_COMMENT D_VC_LONG,
                                IN P_DEVICE_TYPE_ID INT,
                                IN P_CONNECT_TYPE D_VC,
                                IN P_GET_CONFIG_INTERVAL D_VC,
                                IN P_STORE_CONFIG_DAYS INT,
                                IN P_CC_OBJECT_ID INT,
                                IN P_LOCATION D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

INSERT INTO CC_DEVICES(ID, HOST, LOGIN, PWD, ENABLE_PWD, NAME, COMMENT, DEVICE_TYPE_ID, CONNECT_TYPE, GET_CONFIG_INTERVAL, STORE_CONFIG_DAYS, CC_OBJECT_ID, LOCATION)
VALUES(DEFAULT, P_HOST, P_LOGIN, P_PWD, P_ENABLE_PWD, P_NAME, P_COMMENT, P_DEVICE_TYPE_ID, P_CONNECT_TYPE, P_GET_CONFIG_INTERVAL, P_STORE_CONFIG_DAYS, P_CC_OBJECT_ID, P_LOCATION);

SET P_ID = IDENTITY();

END


DROP PROCEDURE CC_DEVICE_ADD

