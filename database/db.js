const mysql = require('mysql');

const config = require('../configs/config');

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.username,
  password: config.db.password,
  database: config.db.database,
});
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }

          connection.release();
        });
      }
    });
  });
};

module.exports = { query, raw: mysql.raw };