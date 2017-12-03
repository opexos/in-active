CREATE TABLE PM_DEVICES (
  ID INTEGER GENERATED BY DEFAULT AS IDENTITY (START WITH 1) NOT NULL, 
  OBJECT_ID INTEGER NOT NULL,
  DEVICE_ID INTEGER NOT NULL,
  COMMENT D_VC_LONG,
  REFRESH_INTERVAL D_VC NOT NULL,
  ARCHIVE_DAYS INTEGER NOT NULL,  
  CONSTRAINT PM_DEVICES_PK PRIMARY KEY (ID),
  CONSTRAINT PM_DEVICES_REF_DEVICES FOREIGN KEY (DEVICE_ID) REFERENCES DEVICES(ID) ON DELETE CASCADE,
  CONSTRAINT PM_DEVICES_REF_OBJECTS FOREIGN KEY (OBJECT_ID) REFERENCES OBJECTS(ID) ON DELETE CASCADE,
  CONSTRAINT PM_DEVICES_UNIQUE_DEVICE_IN_OBJECT UNIQUE (DEVICE_ID,OBJECT_ID)  
)

DROP TABLE PM_DEVICES

