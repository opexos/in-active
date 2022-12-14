CREATE TRIGGER TRG_DEVICES_AFTER_INSERT 
AFTER INSERT ON DEVICES
REFERENCING NEW AS NEW
FOR EACH ROW
INSERT INTO H_DEVICES(WHO_MODIFY, ACTION, ID, MAP, NEW_NAME, NEW_LOCATION, NEW_COMMENT,  NEW_DEVICE_TYPE,  NEW_HOST,  NEW_LOGIN,  NEW_PWD, NEW_ENABLE_PWD, 
                      NEW_CONNECT_TYPE,  NEW_CONSOLE_PORT,  NEW_SNMP_VERSION, NEW_SNMP_PORT,  NEW_READ_COMMUNITY,  NEW_WRITE_COMMUNITY,
                      NEW_SNMP_USER, NEW_SNMP_AUTH_PROT, NEW_SNMP_AUTH_PWD, NEW_SNMP_PRIV_PROT, NEW_SNMP_PRIV_PWD )
VALUES( USER_ID(), 'I', NEW.ID, (SELECT NAME FROM MAPS WHERE ID = NEW.MAP_ID), NEW.NAME, NEW.LOCATION, NEW.COMMENT, (SELECT NAME FROM DEVICE_TYPES WHERE ID = NEW.DEVICE_TYPE_ID),  
                      NEW.HOST,  NEW.LOGIN,  NEW.PWD, NEW.ENABLE_PWD, NEW.CONNECT_TYPE, NEW.CONSOLE_PORT, NEW.SNMP_VERSION, NEW.SNMP_PORT, NEW.READ_COMMUNITY, NEW.WRITE_COMMUNITY,
                      NEW.SNMP_USER, NEW.SNMP_AUTH_PROT, NEW.SNMP_AUTH_PWD, NEW.SNMP_PRIV_PROT, NEW.SNMP_PRIV_PWD )



DROP TRIGGER TRG_DEVICES_AFTER_INSERT

