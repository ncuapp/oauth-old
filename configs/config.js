module.exports = {
  db: {
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'oauth'
  },
  ncuOauth: {
    client_id: 'ODhkOTFkOTAtMDBlNi00MWZlLTk2ODUtMTVlMmUwMDJiNGYx',
    client_secret: '884699ef70d0bfdd92fb8da722944fb25401b78e2fdb1551b7043f1cb0300123069331556806860b8b140d5843b61c3b324b44d5f24f881506f70dcb46d786e5'
  },
  oauth: {
    grants: ['authorization_code', 'implicit'], //, 'password', 'client_credentials'
  },
  server: {
    port: 3030
  }
}