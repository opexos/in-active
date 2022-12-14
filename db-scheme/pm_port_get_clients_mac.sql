CREATE FUNCTION PM_PORT_GET_CLIENTS_MAC(IN P_ID INTEGER) RETURNS D_VC_LONG
READS SQL DATA
BEGIN ATOMIC

DECLARE L_RES D_VC_LONG;

FOR 
		SELECT MAC FROM PM_PORT_CLIENTS WHERE PM_PORT_ID = P_ID ORDER BY IP
DO
		
  SET L_RES = L_RES || CASEWHEN(L_RES IS NULL, NULL, ';') || MAC;

END FOR;


RETURN L_RES;

END


DROP FUNCTION PM_PORT_GET_CLIENTS_MAC

