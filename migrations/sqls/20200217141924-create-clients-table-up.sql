CREATE TABLE IF NOT EXISTS clients (
  name varchar(128) NOT NULL,
  client_id varchar(32) NOT NULL,
  client_secret varchar(128) NOT NULL,
  grant_types int NOT NULL,
  PRIMARY KEY (client_id)
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;