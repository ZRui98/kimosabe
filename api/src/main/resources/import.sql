INSERT INTO ROLES(id, name) VALUES(0, 'ROLE_ADMIN');
INSERT INTO ROLES(id, name) VALUES(1,'ROLE_USER');
INSERT INTO ROLES(id, name) VALUES(2,'ROLE_VERIFIED');
INSERT INTO USERS(id, password, username, email) VALUES('41096c69-47db-4fdb-9a84-bef10e571546', '$argon2id$v=19$m=4096,t=3,p=1$c4QnZmuUngMznjDfDzO3Lw$IfqhldhF+n45fKKydinT4l/K/IaLWBtp6SekT8I+WNA', 'user1', 'user1@example.com');
INSERT INTO USERS(id, password, username, email) VALUES('b72cfbb3-565d-4711-81ad-e6cdf1f349c1', '$argon2id$v=19$m=4096,t=3,p=1$sA5LURP6jE/+fTJ6i3BjIQ$3tDbCo7Rj2umWR3o2h7BTvFO0O0TNHZDXSlwm3h86rw', 'user2', 'user2@example.com');
INSERT INTO USERS(id, password, username, email) VALUES('d0c956e1-05bb-4a45-9213-98c5208ac2b8', '$argon2id$v=19$m=4096,t=3,p=1$HY1vJTI32xnLu2cZtL5i8g$T2lybUinI1cV10WgCfAActshXoLpzuvM/iu9jLF70Vg', 'unverified', 'unverified@example.com');
INSERT INTO USERS_ROLES(user_id, role_id) VALUES('41096c69-47db-4fdb-9a84-bef10e571546', 1);
INSERT INTO USERS_ROLES(user_id, role_id) VALUES('b72cfbb3-565d-4711-81ad-e6cdf1f349c1', 1);
INSERT INTO USERS_ROLES(user_id, role_id) VALUES('d0c956e1-05bb-4a45-9213-98c5208ac2b8', 1);
INSERT INTO USERS_ROLES(user_id, role_id) VALUES('41096c69-47db-4fdb-9a84-bef10e571546', 2);
INSERT INTO USERS_ROLES(user_id, role_id) VALUES('b72cfbb3-565d-4711-81ad-e6cdf1f349c1', 2);
