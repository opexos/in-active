CREATE CACHED TABLE PM_PATCH (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  OBJECT_ID INT NOT NULL,
  PATCH D_VC NOT NULL,
  LOCATION D_VC_LONG,
 
  CONSTRAINT PM_PATCH_PK PRIMARY KEY (ID),
  CONSTRAINT PM_PATCH_UNIQUE_PATCH_IN_OBJECT UNIQUE (OBJECT_ID,PATCH),
  CONSTRAINT PM_PATCH_REF_OBJECTS FOREIGN KEY (OBJECT_ID) REFERENCES OBJECTS(ID) ON DELETE CASCADE
)

DROP TABLE PM_PATCH

