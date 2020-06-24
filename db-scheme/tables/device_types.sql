CREATE TABLE DEVICE_TYPES (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  NAME D_VC NOT NULL,
  GET_CONFIG_SCRIPT_ID INTEGER NOT NULL,
  CONSOLE_AUTH_SCRIPT_ID INTEGER NOT NULL,
  CONSTRAINT DEVICE_TYPES_UNIQUE_NAME UNIQUE (NAME),
  CONSTRAINT DEVICE_TYPES_REF_SCRIPTS FOREIGN KEY (GET_CONFIG_SCRIPT_ID) REFERENCES SCRIPTS(ID),
  CONSTRAINT DEVICE_TYPES_REF_SCRIPTS2 FOREIGN KEY (CONSOLE_AUTH_SCRIPT_ID) REFERENCES SCRIPTS(ID),
  CONSTRAINT DEVICE_TYPES_PK PRIMARY KEY (ID)
)



DROP TABLE DEVICE_TYPES

ALTER TABLE DEVICE_TYPES ADD GET_ARP_SCRIPT_ID INTEGER

ALTER TABLE DEVICE_TYPES ALTER CONSOLE_AUTH_SCRIPT_ID DROP DEFAULT

ALTER TABLE DEVICE_TYPES ADD CONSTRAINT DEVICE_TYPES_REF_SCRIPTS3 FOREIGN KEY (GET_ARP_SCRIPT_ID) REFERENCES SCRIPTS(ID)

SELECT * FROM DEVICE_TYPES


