CREATE TRIGGER TRG_PM_PORT_CLIENTS_AFTER_DELETE AFTER DELETE ON PM_PORT_CLIENTS
REFERENCING OLD AS OLD
FOR EACH ROW
INSERT INTO PM_CLIENTS_ARC (OBJECT_ID, 
                            DEV_NAME,
                            DEV_HOST,
                            DEV_LOCATION,
                            DEV_COMMENT,
                            PORT,
                            TRUNK,
                            VOICE,
                            COMMENT,
                            LOCATION,
                            TELCO,
                            PATCH,
                            VLAN,
                            MAC,
                            IP,
                            NAME,
                            FIRST_DETECT,
                            LAST_DETECT)
SELECT PD.OBJECT_ID, D.NAME, D.HOST, D.LOCATION, D.COMMENT, P.PORT, P.TRUNK, OLD.VOICE, P.COMMENT, PA.LOCATION, P.TELCO, PA.PATCH, OLD.VLAN, OLD.MAC, OLD.IP, OLD.NAME, OLD.FIRST_DETECT, OLD.LAST_DETECT
  FROM PM_PORTS P
  LEFT JOIN PM_PATCH PA ON PA.ID = P.PM_PATCH_ID
  JOIN PM_DEVICES PD ON PD.ID = P.PM_DEVICE_ID
  JOIN DEVICES D ON D.ID = PD.DEVICE_ID
 WHERE P.ID = OLD.PM_PORT_ID








DROP TRIGGER TRG_PM_PORT_CLIENTS_AFTER_DELETE


