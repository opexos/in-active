CREATE TABLE DICT (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  NAME D_VC NOT NULL,
  COMMENT D_VC_LONG,
  CONSTRAINT DICT_UNIQUE_NAME UNIQUE (NAME),
  CONSTRAINT DICT_PK PRIMARY KEY (ID)
)



DROP TABLE DICT