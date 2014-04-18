CREATE PROCEDURE CC_CONFIG_HISTORY_SET_CHECKED(IN P_ID INT,
                                               IN P_CHECKED BOOLEAN)
MODIFIES SQL DATA 
BEGIN ATOMIC 

UPDATE CC_CONFIG_HISTORY
SET CHECKED = P_CHECKED,
    WHEN_CHECKED = SYSDATE,
    WHO_CHECKED = USER_GET_AUTH()
WHERE ID = P_ID;

END


DROP PROCEDURE CC_CONFIG_HISTORY_SET_CHECKED












