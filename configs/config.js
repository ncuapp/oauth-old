const res = require('dotenv').config({ path: './configs/.env' });

const nanoid = require('nanoid');

module.exports = {
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  ncuOauth: {
    client_id: process.env.NCU_OAUTH_CLIENT_ID,
    client_secret: process.env.NCU_OAUTH_CLIENT_SECRET,
  },
  oauth: {
    grants: process.env.OAUTH_GRANTS.split(/\s*,\s*/),
  },
  server: {
    port: process.env.SERVER_PORT,
    salt: process.env.SERVER_SALT || nanoid(16),
  }
}