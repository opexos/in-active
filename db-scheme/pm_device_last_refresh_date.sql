CREATE FUNCTION PM_DEVICE_LAST_REFRESH_DATE (P_PM_DEVICE_ID INT)
  RETURNS TIMESTAMP
  READS SQL DATA
  RETURN (SELECT MAX(LOG_DATE)
            FROM PM_LOG
           WHERE PM_DEVICE_ID = P_PM_DEVICE_ID)
             



DROP FUNCTION PM_DEVICE_LAST_REFRESH_DATE

