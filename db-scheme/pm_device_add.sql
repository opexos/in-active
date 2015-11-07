CREATE PROCEDURE PM_DEVICE_ADD(OUT P_ID INT,
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
                                IN P_PM_OBJECT_ID INT,
                                IN P_LOCATION D_VC_LONG) 
MODIFIES SQL DATA 
BEGIN ATOMIC 

INSERT INTO PM_DEVICES(ID, HOST, SNMP_VERSION, LOGIN, PWD, READ_COMMUNITY, WRITE_COMMUNITY, NAME, COMMENT, DEVICE_TYPE_ID, REFRESH_INTERVAL, PM_OBJECT_ID, ARCHIVE_DAYS, LOCATION)
VALUES(DEFAULT, P_HOST, P_SNMP_VERSION, P_LOGIN, P_PWD, P_READ_COMMUNITY, P_WRITE_COMMUNITY, P_NAME, P_COMMENT, P_DEVICE_TYPE_ID, P_REFRESH_INTERVAL, P_PM_OBJECT_ID, P_ARCHIVE_DAYS, P_LOCATION);

SET P_ID = IDENTITY();

END




DROP PROCEDURE PM_DEVICE_ADD



