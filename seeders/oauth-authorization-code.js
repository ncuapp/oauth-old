const moment = require('moment');
const nanoid = require('nanoid');
const faker = require('faker/locale/en');
const db = require('../database/db');

module.exports = {
  async up(clientsCount = 2, usersCount = 2, scopesCount = 50) {

    /* Table clients */
    let clients = Array.from({ length: clientsCount }, () => [faker.internet.userName(), nanoid(32), nanoid(128), 15]);
    await db.query('INSERT INTO clients (name, client_id, client_secret, grant_types) VALUES ?', [clients]);

    /* Table clients_redirect_uris */
    let redirect_uri = [];
    for (let row of clients) {
      let data = Array.from({ length: faker.finance.amount(1, 10, 0) }, () => ([row[1], faker.internet.url()]));
      await db.query('INSERT INTO clients_redirect_uris (client_id, redirect_uri) VALUES ?', [data]);
      redirect_uri.push(data);
    }

    /* Table users */
    let users = Array.from({ length: usersCount }, () => [
      nanoid(32),
      faker.finance.amount(100000000, 999999999, 0),
      faker.lorem.word(),
      faker.lorem.word(),
      faker.lorem.word(),
      faker.internet.userName(),
      faker.internet.password(),
      faker.internet.password(),
      moment().utc().add(60 * 60 * 8 * 1000).format('YYYY-MM-DD HH:mm:ss')
    ]);
    await db.query("INSERT INTO users (uid, school_number, school_type, school_unit, school_group, name, ncu_oauth_access_token, ncu_oauth_refresh_token, ncu_oauth_expires_at) VALUES ?", [users]);

    /* Table scopes */
    let scopes = Array.from({ length: scopesCount }, () => [faker.lorem.word()]);
    await db.query("INSERT IGNORE INTO scopes (name) VALUES ?", [scopes]);

    /* Table allow_scopes */
    let allowScopes = Array.from(scopes, (val, idx) => [
      users[Number.parseInt(faker.finance.amount(0, usersCount - 1, 0))][0],
      clients[Number.parseInt(faker.finance.amount(0, clientsCount - 1, 0))][1],
      val[0]
    ]);
    await db.query("INSERT IGNORE INTO allow_scopes (user_id, client_id, scope) VALUES ?", [allowScopes]);

    console.log(`
      client_id: "${clients[0][1]}",
      client_secret: "${clients[0][2]}",

      user_id: "${users[0][0]}",

      allowScopes: "${allowScopes.filter(val => val[0] === users[0][0] && val[1] === clients[0][1]).map(val => val[2]).join(' ')}",

      all_scope: "${scopes.join(' ')}"`)
  },
  async down() {
    await db.query('SET foreign_key_checks = 0;');
    await db.query('TRUNCATE oauth.clients;');
    await db.query('TRUNCATE oauth.clients_redirect_uris;');
    await db.query('SET foreign_key_checks = 1;');
  }
}