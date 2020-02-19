CREATE TABLE IF NOT EXISTS users (
  uid varchar(32) NOT NULL UNIQUE,
  school_number varchar(9) NOT NULL UNIQUE,
  school_type varchar(32) NOT NULL,
  school_unit varchar(32) NOT NULL,
  school_group varchar(32) NOT NULL,
  name varchar(132) NOT NULL,
  ncu_oauth_access_token varchar(192) NOT NULL,
  ncu_oauth_refresh_token varchar(192) NOT NULL,
  ncu_oauth_expires_at timestamp NOT NULL,
  PRIMARY KEY (uid)
) ENGINE = innodb DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;