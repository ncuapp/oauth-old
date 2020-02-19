CREATE TABLE IF NOT EXISTS authorization_codes (
  authorization_code varchar(40) NOT NULL,
  user_id varchar(32) NOT NULL,
  client_id varchar(32) NOT NULL,
  expires_at timestamp NOT NULL,
  redirect_uri varchar(2048) NOT NULL,
  PRIMARY KEY (authorization_code),
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci