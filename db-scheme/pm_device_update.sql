CREATE PROCEDURE PM_DEVICE_UPDATE(IN P_ID INT,
                                IN P_HOST D_VC,
                                IN P_SNMP_VERSION INT,
                                IN P_LOGIN D_VC,
                                IN P_PWD D_VC,
                                IN P_READ_COMMUNITY D_VC,
                                IN P_WRITE_COMMUNITY D_VC,
                                IN P_NAME D_VC,
                                IN P_COMMENT D_VC_LONG,
                                IN P_DEVICE_TYPE_ID INT,
                                IN P_REFRESH_INTERVAL D_VC,
                                IN P_ARCHIVE_DAYS INT,
                                IN P_LOCATION D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

UPDATE PM_DEVICES
SET HOST = P_HOST, 
	  SNMP_VERSION = P_SNMP_VERSION,
    LOGIN = P_LOGIN,
    PWD = P_PWD, 
	  READ_COMMUNITY = P_READ_COMMUNITY,
    WRITE_COMMUNITY = P_WRITE_COMMUNITY,
    NAME = P_NAME, 
    COMMENT = P_COMMENT, 
    DEVICE_TYPE_ID = P_DEVICE_TYPE_ID, 
    REFRESH_INTERVAL = P_REFRESH_INTERVAL,
    ARCHIVE_DAYS = P_ARCHIVE_DAYS,
    LOCATION = P_LOCATION
WHERE ID = P_ID;

IF DIAGNOSTICS(ROW_COUNT) = 0 THEN
  SIGNAL SQLSTATE '01000' SET MESSAGE_TEXT = 'NO_DATA_FOUND';
END IF;

END


DROP PROCEDURE PM_DEVICE_UPDATE

