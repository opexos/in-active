CREATE TABLE SCRIPT_EXECUTE_LOG (
  DEV_HOST D_VC NOT NULL,
  DEV_NAME D_VC NOT NULL,  
  WHO_EXECUTE INTEGER NOT NULL,
  WHEN_EXECUTE TIMESTAMP NOT NULL,
  SCRIPT_NAME D_VC NOT NULL,
  SCRIPT_PARAMS D_VC_LONG,
  CONSOLE CLOB,
  LOG	CLOB,
  RESULT D_RESULT NOT NULL,
  CONSTRAINT SCRIPT_EXECUTE_LOG_REF_USERS FOREIGN KEY (WHO_EXECUTE) REFERENCES USERS(ID)
)

DROP TABLE SCRIPT_EXECUTE_LOG

