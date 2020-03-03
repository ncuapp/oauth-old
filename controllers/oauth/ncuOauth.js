const axios = require('axios').default;
const moment = require('moment');
const nanoid = require('nanoid');

const db = require('../../database/db')
const configs = require('../../configs/config');

module.exports = {
  async login(ctx) {
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

    const row = await db.query('SELECT school_number FROM users WHERE school_number = ?', [userInfo.number]);
    if (row.length) {
      await db.query('UPDATE users SET ?', [user]);
    } else {
      await db.query('INSERT INTO users SET ?', [Object.assign({ uid: nanoid(32) }, user)]);
    }

    console.log(user);
    ctx.body = '<script>window.close();</script>';
  }
}