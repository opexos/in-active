CREATE TABLE H_PM_PORTS (
  WHO_MODIFY INTEGER NOT NULL,
  WHEN_MODIFY TIMESTAMP DEFAULT SYSDATE NOT NULL,   
  ACTION D_TABLE_ACTION NOT NULL,
  ID INTEGER NOT NULL, 
  DEV_HOST D_VC NOT NULL,
  DEV_NAME D_VC NOT NULL,
  PORT D_VC NOT NULL,
  OLD_TELCO D_VC,
  OLD_PATCH D_VC,
  OLD_LOCATION D_VC_LONG,
  OLD_COMMENT D_VC_LONG,  
  NEW_TELCO D_VC,
  NEW_PATCH D_VC,
  NEW_LOCATION D_VC_LONG,
  NEW_COMMENT D_VC_LONG,  
  CONSTRAINT H_PM_PORTS_REF_USERS FOREIGN KEY (WHO_MODIFY) REFERENCES USERS(ID)
)


DROP TABLE H_PM_PORTS



