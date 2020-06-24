CREATE TABLE H_PM_PORTS_CHANGES (
  WHO_CHANGE INTEGER NOT NULL,
  WHEN_CHANGE TIMESTAMP DEFAULT LOCALTIMESTAMP NOT NULL,   
  DEV_HOST D_VC NOT NULL,
  DEV_NAME D_VC NOT NULL,
  PORT D_VC NOT NULL,
  ACTION D_VC NOT NULL,
  VAL D_VC,  
  CONSTRAINT H_PM_PORTS_CHANGES_REF_USERS FOREIGN KEY (WHO_CHANGE) REFERENCES USERS(ID)
)


DROP TABLE H_PM_PORTS_CHANGES
