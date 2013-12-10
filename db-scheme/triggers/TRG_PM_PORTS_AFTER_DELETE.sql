CREATE TRIGGER TRG_PM_PORTS_AFTER_DELETE 
AFTER DELETE ON PM_PORTS
REFERENCING OLD AS OLD
FOR EACH ROW
INSERT INTO H_PM_PORTS(WHO_MODIFY, ACTION, ID, DEV_HOST, DEV_NAME, PORT, OLD_TELCO, OLD_PATCH, OLD_LOCATION, OLD_COMMENT)
SELECT USER_ID(), 'D', OLD.ID, D.HOST, D.NAME, OLD.PORT, OLD.TELCO, P.PATCH, P.LOCATION, OLD.COMMENT
FROM PM_DEVICES PD
JOIN DEVICES D ON D.ID = PD.DEVICE_ID
LEFT JOIN PM_PATCH P ON P.ID = OLD.PM_PATCH_ID
WHERE PD.ID = OLD.PM_DEVICE_ID
  AND USER_ID() IS NOT NULL




DROP TRIGGER TRG_PM_PORTS_AFTER_DELETE 

