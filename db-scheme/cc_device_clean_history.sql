CREATE PROCEDURE CC_DEVICE_CLEAN_HISTORY()
MODIFIES SQL DATA
BEGIN ATOMIC

FOR 

    SELECT D.ID AS $ID, D.STORE_CONFIG_DAYS AS $DAYS,
					(SELECT TOP 1 L.ID
					   FROM CC_LOG L
					  WHERE L.CC_DEVICE_ID = D.ID
					  ORDER BY L.LOG_DATE DESC) AS $LAST_LOG,
					(SELECT TOP 1 H.ID
					   FROM CC_CONFIG_HISTORY H
					  WHERE H.CC_DEVICE_ID = D.ID
					  ORDER BY H.CONFIG_DATE DESC) AS $LAST_CONFIG
		FROM CC_DEVICES D

DO

		DELETE FROM CC_LOG 
		      WHERE CC_DEVICE_ID = $ID 
		        AND LOG_DATE < SYSDATE - $DAYS DAY 
		        AND ID != $LAST_LOG;
		        
		DELETE FROM CC_CONFIG_HISTORY 
		      WHERE CC_DEVICE_ID = $ID 
		        AND CONFIG_DATE < SYSDATE - $DAYS DAY 
		        AND ID != $LAST_CONFIG;

END FOR;

END


DROP PROCEDURE CC_DEVICE_CLEAN_HISTORY


