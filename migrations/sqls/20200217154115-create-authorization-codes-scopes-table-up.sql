CREATE TABLE IF NOT EXISTS authorization_codes_scopes (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  authorization_codes_id varchar(40) NOT NULL,
  scope varchar(128) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (authorization_codes_id) REFERENCES authorization_codes(authorization_code) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (scope) REFERENCES scopes(name) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci