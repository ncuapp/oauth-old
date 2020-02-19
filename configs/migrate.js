const configs = require('./config');

module.exports = {
  "defaultEnv": "oauth",
  "oauth": {
    "host": configs.db.host,
    "user": configs.db.username,
    "password": configs.db.password,
    "database": configs.db.database,
    "driver": "mysql",
    "multipleStatements": true
  },
  "sql-file": true
}