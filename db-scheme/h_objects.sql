CREATE TABLE H_OBJECTS (
  WHO_MODIFY INTEGER NOT NULL,
  WHEN_MODIFY TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL,   
  ACTION D_TABLE_ACTION NOT NULL,
  ID INTEGER NOT NULL, 
  OLD_MAP_NAME D_VC,
  OLD_NAME D_VC,
  OLD_COMMENT D_VC_LONG,
  NEW_MAP_NAME D_VC,
  NEW_NAME D_VC,
  NEW_COMMENT D_VC_LONG,
  CONSTRAINT H_OBJECTS_REF_USERS FOREIGN KEY (WHO_MODIFY) REFERENCES USERS(ID)
)


DROP TABLE H_OBJECTS
