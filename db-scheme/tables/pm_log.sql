CREATE CACHED TABLE PM_LOG (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  PM_DEVICE_ID INTEGER NOT NULL,
  LOG_DATE TIMESTAMP DEFAULT SYSDATE NOT NULL,
  RESULT D_RESULT NOT NULL,
  ERROR_LOG D_VC_LONG,
  CONSTRAINT PM_LOG_PK PRIMARY KEY (ID),
  CONSTRAINT PM_LOG_REF_PM_DEVICES FOREIGN KEY (PM_DEVICE_ID) REFERENCES PM_DEVICES(ID) ON DELETE CASCADE
)



DROP TABLE PM_LOG
