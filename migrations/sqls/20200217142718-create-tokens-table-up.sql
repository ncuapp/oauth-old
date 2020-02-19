CREATE TABLE IF NOT EXISTS tokens (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id varchar(32) NOT NULL,
  client_id varchar(32) NOT NULL,
  access_token varchar(40) NOT NULL,
  access_token_expires_at timestamp NOT NULL,
  refresh_token varchar(40) NOT NULL,
  refresh_token_expires_at timestamp NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;