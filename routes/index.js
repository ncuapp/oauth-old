const Router = require('koa-router');
const oauth = require('./oauth');

const router = new Router();

router.use(oauth.routes());

module.exports = router;