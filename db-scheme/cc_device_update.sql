CREATE PROCEDURE CC_DEVICE_UPDATE(IN P_ID INT,
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
                                IN P_LOCATION D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

UPDATE CC_DEVICES
SET HOST = P_HOST, 
    LOGIN = P_LOGIN,
    PWD = P_PWD, 
    ENABLE_PWD = P_ENABLE_PWD,
    NAME = P_NAME, 
    COMMENT = P_COMMENT, 
    DEVICE_TYPE_ID = P_DEVICE_TYPE_ID, 
    CONNECT_TYPE = P_CONNECT_TYPE, 
    GET_CONFIG_INTERVAL = P_GET_CONFIG_INTERVAL, 
    STORE_CONFIG_DAYS = P_STORE_CONFIG_DAYS,
    LOCATION = P_LOCATION
WHERE ID = P_ID;

IF DIAGNOSTICS(ROW_COUNT) = 0 THEN
  SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'NO_DATA_FOUND';
END IF;

END


DROP PROCEDURE CC_DEVICE_UPDATE

