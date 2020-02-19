const axios = require('axios').default;
const moment = require('moment');
const nanoid = require('nanoid');
const Request = require('oauth2-server').Request;
const Response = require('oauth2-server').Response;

const db = require('../../database/db')
const configs = require('../../configs/config');

const login = async (ctx) => {
  const code = ctx.query.code;
  const token = (await axios.post('https://api.cc.ncu.edu.tw/oauth/oauth/token', null, {
    params: {
      grant_type: 'authorization_code',
      code,
      client_id: configs.ncuOauth.client_id,
      client_secret: configs.ncuOauth.client_secret
    }
  })).data;
  const userInfo = (await axios.get('https://api.cc.ncu.edu.tw/personnel/v1/info', {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })).data;

  const user = {
    school_number: userInfo.number,
    school_type: userInfo.type,
    school_unit: userInfo.unit,
    school_group: userInfo.group,
    name: userInfo.name,
    ncu_oauth_access_token: token.access_token,
    ncu_oauth_refresh_token: token.refresh_token,
    ncu_oauth_expires_at: moment().utc().add(token.expires_in * 1000).format('YYYY-MM-DD HH:mm:ss')
  };

  const row = await db.query('SELECT uid, school_number FROM users WHERE school_number = ?', [userInfo.number]);
  if (row.length) {
    await db.query('UPDATE users SET ? WHERE school_number = ?', [user, row[0].school_number]);
    user.uid = row[0].uid
  } else {
    await db.query('INSERT INTO users SET ?', [Object.assign({ uid: nanoid(32) }, user)]);
  }

  console.log(user);
  ctx.body = '<script>window.close();</script>';
  ctx.app.oauth.resolve(user);
}

module.exports = {
  async token(ctx) {
    let token = await ctx.app.oauth.token(new Request(ctx.request), new Response(ctx.response));
    console.log(token)
    ctx.body = token;
  },
  async authorize(ctx) {
    ctx.app.oauth.authorize(new Request(ctx.request), new Response(ctx.response), {
      allowEmptyState: true,
      authenticateHandler: {
        async handle(req, res) {
          return await new Promise(function (resolve, reject) {
            ctx.app.oauth.resolve = resolve;
          });
        }
      }
    });
    ctx.redirect('https://api.cc.ncu.edu.tw/oauth/oauth/authorize'
      + '?response_type=code'
      + '&scope=course.schedule.read+calendar.event.read+calendar.event.write+user.info.basic.read'
      + '&client_id=ODhkOTFkOTAtMDBlNi00MWZlLTk2ODUtMTVlMmUwMDJiNGYx');
  },
  login
}