CREATE FUNCTION PM_DEVICE_PORTS_QTY (IN P_PM_DEVICE_ID INT)
  RETURNS INT
  READS SQL DATA
  RETURN (SELECT COUNT(*)
            FROM PM_PORTS
           WHERE PM_DEVICE_ID = P_PM_DEVICE_ID)
             



DROP FUNCTION PM_DEVICE_PORTS_QTY


