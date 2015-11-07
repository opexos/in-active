CREATE FUNCTION PM_DEVICE_LAST_REFRESH_RESULT (P_PM_DEVICE_ID INT)
  RETURNS D_RESULT
  READS SQL DATA
  RETURN (SELECT TOP 1 RESULT
            FROM PM_LOG
           WHERE PM_DEVICE_ID = P_PM_DEVICE_ID
           ORDER BY LOG_DATE DESC)
             



DROP FUNCTION PM_DEVICE_LAST_REFRESH_RESULT

