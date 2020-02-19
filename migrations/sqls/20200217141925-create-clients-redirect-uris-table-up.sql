CREATE TABLE IF NOT EXISTS clients_redirect_uris (
  id int UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id varchar(32) NOT NULL,
  redirect_uri varchar(2048) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci