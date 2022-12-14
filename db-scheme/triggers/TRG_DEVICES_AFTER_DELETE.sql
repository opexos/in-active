CREATE TRIGGER TRG_DEVICES_AFTER_DELETE
AFTER DELETE ON DEVICES
REFERENCING OLD AS OLD
FOR EACH ROW
INSERT INTO H_DEVICES(WHO_MODIFY, ACTION, ID, MAP, OLD_NAME, OLD_LOCATION, OLD_COMMENT,  OLD_DEVICE_TYPE,  OLD_HOST,  OLD_LOGIN,  OLD_PWD, OLD_ENABLE_PWD, 
													OLD_CONNECT_TYPE,  OLD_CONSOLE_PORT,  OLD_SNMP_VERSION, OLD_SNMP_PORT,  OLD_READ_COMMUNITY,  OLD_WRITE_COMMUNITY, 
                      OLD_SNMP_USER, OLD_SNMP_AUTH_PROT, OLD_SNMP_AUTH_PWD, OLD_SNMP_PRIV_PROT, OLD_SNMP_PRIV_PWD )
VALUES( USER_ID(), 'D', OLD.ID, (SELECT NAME FROM MAPS WHERE ID = OLD.MAP_ID), OLD.NAME, OLD.LOCATION, OLD.COMMENT, (SELECT NAME FROM DEVICE_TYPES WHERE ID = OLD.DEVICE_TYPE_ID),  
											 OLD.HOST,  OLD.LOGIN,  OLD.PWD, OLD.ENABLE_PWD, OLD.CONNECT_TYPE, OLD.CONSOLE_PORT, OLD.SNMP_VERSION, OLD.SNMP_PORT, OLD.READ_COMMUNITY, OLD.WRITE_COMMUNITY,
                      OLD.SNMP_USER, OLD.SNMP_AUTH_PROT, OLD.SNMP_AUTH_PWD, OLD.SNMP_PRIV_PROT, OLD.SNMP_PRIV_PWD)



DROP TRIGGER TRG_DEVICES_AFTER_DELETE

