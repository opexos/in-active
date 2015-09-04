CREATE TABLE H_MAPS (
  WHO_MODIFY INTEGER NOT NULL,
  WHEN_MODIFY TIMESTAMP DEFAULT SYSDATE NOT NULL,   
  ACTION D_TABLE_ACTION NOT NULL,
  ID INTEGER NOT NULL, 
  OLD_NAME D_VC,
  OLD_COMMENT D_VC_LONG,
  NEW_NAME D_VC,
  NEW_COMMENT D_VC_LONG,
  CONSTRAINT H_MAPS_REF_USERS FOREIGN KEY (WHO_MODIFY) REFERENCES USERS(ID)
)


DROP TABLE H_MAPS


