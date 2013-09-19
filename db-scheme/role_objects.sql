CREATE TABLE ROLE_OBJECTS (
  ROLE_ID INT NOT NULL,
  OBJECT_ID INT NOT NULL,
  MODE D_VC NOT NULL,
  CONSTRAINT ROLE_OBJECTS_PK PRIMARY KEY (ROLE_ID, OBJECT_ID),
  CONSTRAINT ROLE_OBJECTS_REF_OBJECTS FOREIGN KEY (OBJECT_ID) REFERENCES OBJECTS(ID) ON DELETE CASCADE,
  CONSTRAINT ROLE_OBJECTS_REF_ROLES FOREIGN KEY (ROLE_ID) REFERENCES ROLES(ID) ON DELETE CASCADE
)
 
 
 DROP TABLE ROLE_OBJECTS
