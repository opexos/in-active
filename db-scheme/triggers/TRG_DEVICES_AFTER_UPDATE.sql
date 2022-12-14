CREATE TRIGGER TRG_DEVICES_AFTER_UPDATE
AFTER UPDATE ON DEVICES
REFERENCING NEW AS NEW OLD AS OLD
FOR EACH ROW
INSERT INTO H_DEVICES(WHO_MODIFY, ACTION, ID, MAP, 
                      OLD_NAME, OLD_LOCATION, OLD_COMMENT,  OLD_DEVICE_TYPE,  OLD_HOST,  OLD_LOGIN,  OLD_PWD, OLD_ENABLE_PWD, 
													OLD_CONNECT_TYPE,  OLD_CONSOLE_PORT,  OLD_SNMP_VERSION, OLD_SNMP_PORT,  OLD_READ_COMMUNITY,  OLD_WRITE_COMMUNITY ,
                      OLD_SNMP_USER, OLD_SNMP_AUTH_PROT, OLD_SNMP_AUTH_PWD, OLD_SNMP_PRIV_PROT, OLD_SNMP_PRIV_PWD,
                      NEW_NAME, NEW_LOCATION, NEW_COMMENT,  NEW_DEVICE_TYPE,  NEW_HOST,  NEW_LOGIN,  NEW_PWD, NEW_ENABLE_PWD, 
													NEW_CONNECT_TYPE,  NEW_CONSOLE_PORT,  NEW_SNMP_VERSION, NEW_SNMP_PORT,  NEW_READ_COMMUNITY,  NEW_WRITE_COMMUNITY,
                      NEW_SNMP_USER, NEW_SNMP_AUTH_PROT, NEW_SNMP_AUTH_PWD, NEW_SNMP_PRIV_PROT, NEW_SNMP_PRIV_PWD )
VALUES( USER_ID(), 'U', NEW.ID, (SELECT NAME FROM MAPS WHERE ID = NEW.MAP_ID), 
                      OLD.NAME, OLD.LOCATION, OLD.COMMENT, (SELECT NAME FROM DEVICE_TYPES WHERE ID = OLD.DEVICE_TYPE_ID),  
											 OLD.HOST,  OLD.LOGIN,  OLD.PWD, OLD.ENABLE_PWD, OLD.CONNECT_TYPE, OLD.CONSOLE_PORT, OLD.SNMP_VERSION, OLD.SNMP_PORT, OLD.READ_COMMUNITY, OLD.WRITE_COMMUNITY,
                      OLD.SNMP_USER, OLD.SNMP_AUTH_PROT, OLD.SNMP_AUTH_PWD, OLD.SNMP_PRIV_PROT, OLD.SNMP_PRIV_PWD,
                      NEW.NAME, NEW.LOCATION, NEW.COMMENT, (SELECT NAME FROM DEVICE_TYPES WHERE ID = NEW.DEVICE_TYPE_ID),  
											 NEW.HOST,  NEW.LOGIN,  NEW.PWD, NEW.ENABLE_PWD, NEW.CONNECT_TYPE, NEW.CONSOLE_PORT, NEW.SNMP_VERSION, NEW.SNMP_PORT, NEW.READ_COMMUNITY, NEW.WRITE_COMMUNITY,
                     NEW.SNMP_USER, NEW.SNMP_AUTH_PROT, NEW.SNMP_AUTH_PWD, NEW.SNMP_PRIV_PROT, NEW.SNMP_PRIV_PWD 
            )



DROP TRIGGER TRG_DEVICES_AFTER_UPDATE


