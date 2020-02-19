const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const OAuth2Server = require('oauth2-server');

const router = require('./routes');
const configs = require('./configs/config');

const app = new Koa();
app.oauth = new OAuth2Server({
  model: require('./models/oauth'),
  alwaysIssueNewRefreshToken: false,
});


app.use(logger());
app.use(bodyParser());
app.use(views('./views', { extension: 'pug' }))
app.use(router.routes());

app.listen(configs.server.port);

if (process.env.ENV === 'debug') {
  console.log(`Listening on port http://localhost${configs.server.port}`);
  let seeding = () => {
    const seeders = require('./seeders');
    for (let seeder in seeders) {
      (async () => {
        await seeders[seeder].down();
        await seeders[seeder].up();
      })()
    }
  }
  // seeding();
}