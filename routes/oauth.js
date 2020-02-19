const Router = require('koa-router');

const oauthController = require('../controllers/oauth');

const router = new Router();
router.prefix('/oauth');

router.get('/', oauthController.ncuapp.oauth);
router.get('/authorize', oauthController.ncuapp.authorize);
router.post('/token', oauthController.ncuapp.token);

router.get('/test', async (ctx) => {
  ctx.body = 'return to client success';
})
module.exports = router;