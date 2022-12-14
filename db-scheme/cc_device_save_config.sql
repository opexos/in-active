CREATE PROCEDURE CC_DEVICE_SAVE_CONFIG(IN P_DEVICE_ID INT,
                                       IN P_CONFIG D_VC_CLOB) 
MODIFIES SQL DATA
BEGIN ATOMIC

  DECLARE L_CUR_CONFIG D_VC_CLOB;
  SET L_CUR_CONFIG = CC_DEVICE_GET_CURRENT_CONFIG(P_DEVICE_ID);
  
  IF L_CUR_CONFIG = P_CONFIG THEN
    INSERT INTO CC_LOG(CC_DEVICE_ID, RESULT)
    VALUES(P_DEVICE_ID, 'UNCHANGED');  
  ELSE 
	  INSERT INTO CC_CONFIG_HISTORY(CC_DEVICE_ID, CONFIG, WHEN_CHECKED)
    VALUES(P_DEVICE_ID, P_CONFIG, CASEWHEN(L_CUR_CONFIG IS NULL, SYSDATE, NULL));
    INSERT INTO CC_LOG(CC_DEVICE_ID, RESULT)
    VALUES(P_DEVICE_ID, TRIM(CASEWHEN(L_CUR_CONFIG IS NULL, 'UNCHANGED', 'CHANGED')));    
  END IF;

END                                       


DROP PROCEDURE CC_DEVICE_SAVE_CONFIG


