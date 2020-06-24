CREATE TABLE USER_VARIABLES (
  USER_ID INTEGER NOT NULL, 
  NAME D_VC NOT NULL,
  VAL VARCHAR(10000),
  CONSTRAINT USER_VARIABLES_PK PRIMARY KEY (USER_ID,NAME),
  CONSTRAINT USER_VARIABLES_REF_USERS FOREIGN KEY (USER_ID) REFERENCES USERS(ID) ON DELETE CASCADE
)



DROP TABLE USER_VARIABLES  


