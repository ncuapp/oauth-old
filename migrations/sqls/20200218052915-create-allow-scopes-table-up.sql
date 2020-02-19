CREATE TABLE IF NOT EXISTS allow_scopes (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id varchar(32) NOT NULL,
  client_id varchar(32) NOT NULL,
  scope varchar(128) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(uid) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (scope) REFERENCES scopes(name) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY (user_id, client_id, scope)
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;