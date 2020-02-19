const Router = require('koa-router');

const oauthController = require('../controllers/oauth');

const router = new Router();

router.post('/token', oauthController.ncuapp.token);
router.get('/authorize', oauthController.ncuapp.authorize);

router.get('/ncuOauth/callback', oauthController.ncuapp.login);
router.get('/test', async (ctx) => {
  ctx.redirect('https://api.cc.ncu.edu.tw/oauth/oauth/authorize'
    + '?response_type=code'
    + '&scope=course.schedule.read+calendar.event.read+calendar.event.write+user.info.basic.read'
    + '&client_id=ODhkOTFkOTAtMDBlNi00MWZlLTk2ODUtMTVlMmUwMDJiNGYx');
})
module.exports = router;