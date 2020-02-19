const Enum = require('enum');

const db = require('../database/db');

const grants = new Enum(['authorization_code', 'password', 'client_credentials', 'implicit'], { separator: '|' });

module.exports = {
  // async generateAccessToken(client, user, scope) {},
  // async generateRefreshToken(client, user, scope) {},
  // async generateAuthorizationCode(client, user, scope) {},
  async getAccessToken(accessToken) {
    let token = (await db.query('SELECT id, user_id, client_id, access_token, access_token_expire_at, refresh_token, refresh_token_expires_at FROM tokens WHERE access_token = ?', [access_token]))[0];
    let token_scopes = (await db.query('SELECT id, token_id, scope FROM token_scopes WHERE token_id = ?', [token.id])).map(val => val.scope);
    let client = (await db.query('SELECT name, client_id, client_secret FROM clients WHERE client_id = ?', [token.client_id]))[0];
    let user = (await db.query('SELECT uid, name FROM users WHERE uid = ?', [token.user_id]))[0];

    return {
      accessToken: token.access_token,
      accessTokenExpiresAt: token.access_token_expires_at,
      scope: token_scopes,
      client: client, // with 'id' property
      user: user
    };
  },
  // TODO let authorization_code as unique.
  async getAuthorizationCode(authorizationCode) {
    let row = await db.query('SELECT id, code, expires_at, redirect_uri FROM authorization_codes WHERE code = ?', authorizationCode);
    let scope = await db.query('SELECT id, authorization_codes_id, scope FROM `authorization_codes_scopes` WHERE authorization_codes_id = ?', row.id).filter(val => val.scope);

    return {
      code: row.code,
      expiresAt: row.expires_at,
      redirectUri: row.redirect_uri,
      scope: code.scope,
      client: { id: row.client_id },
      user: { id: row.user_id }
    };
  },
  async getClient(clientId, clientSecret) {
    let params = { client_id: clientId };

    if (clientSecret) {
      params.client_secret = clientSecret;
    }

    let client = await db.query('SELECT name, client_id, client_secret, grant_types FROM clients WHERE client_id = ?;', clientId);
    if (client) {
      client = client[0];
      let redirect_uris = await db.query('SELECT id, client_id, redirect_uri FROM clients_redirect_uris WHERE client_id = ?;', client.client_id);
      return {
        id: client.client_id,
        redirectUris: redirect_uris.map(row => row.redirect_uri),
        grants: grants.getKey(client.grant_types).split('|')
      };
    } else {
      return false;
    }
  },
  // TODO password not select
  async getUser(username, password) {
    return (await db.query('SELECT uid, name FROM users WHERE uid = ?', [username]))[0];
  },
  async saveToken(token, client, user) {
    let row = await db.query('INSERT INTO tokens SET ?', {
      user_id: user.uid,
      client_id: client.id,
      access_token: token.accessToken,
      access_token_expires_at: token.accessTokenExpiresAt,
      refresh_token: token.refreshToken,
      refresh_token_expires_at: token.refreshTokenExpiresAt,
    });

    await db.query('INSERT INTO tokens_scopes SET ?', token.scope.map(val => ({ token_id: row.insertId, scope: val })));

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.accessTokenExpiresAt,
      scope: token.scope,
      client: client,
      user: user
    };
  },
  async saveAuthorizationCode(code, client, user) {
    let row = await db.query('INSERT INTO authorization_codes SET ?', {
      authorization_code: code.authorizationCode,
      user_id: user.uid,
      client_id: client.id,
      expires_at: code.expiresAt,
      redirect_uri: code.redirectUri
    });

    // await db.query('INSERT INTO authorization_codes_scope SET ?', [code.scope.map(val => ({ authorization_codes_id: row.insertId, scope: val }))]);

    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client,
      user: user
    };
  },
  async revokeAuthorizationCode(code) {
    try {
      return db, query('DELETE FROM authorization_codes WHERE authorization_codes.id = ?', code.id);
    } catch (e) {
      return e;
    }
  },
  async validateScope(user, client, scope) {
    let row = await db.query('SELECT user_id, client_id, scope FROM allow_scopes WHERE user_id = ? AND client_id = ?', [user.uid, client.id]);
    if (row) {
      row = row.map(val => val.scope);
      return [...new Set(scope.split(' '))].filter(val => row.includes(val));
    } else {
      return false;
    }
  }
}