CREATE TABLE SCRIPTS (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  NAME D_VC NOT NULL,
  TYPE D_SCRIPT_TYPE NOT NULL,
  SCRIPT D_SCRIPT NOT NULL,
  PUBLIC BOOLEAN DEFAULT FALSE NOT NULL,
  CONSTRAINT SCRIPTS_UNIQUE_NAME UNIQUE (NAME),
  CONSTRAINT SCRIPTS_PK PRIMARY KEY (ID)
)


DROP TABLE SCRIPTS




