require('zone.js/dist/zone-node');

const express = require('express');
const helmet = require('helmet');
const serveStatic = require('serve-static')

const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;

require('@angular/core').enableProdMode();

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require(`./dist-server/main`);

const app = express();

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", "app.grassroot.org.za"],
    scriptSrc: ["'self'", "use.fontawesome.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdn.quilljs.com"],
    fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com"]
  }
}));
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }))

const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const provider = provideModuleMap(LAZY_MODULE_MAP);

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provider]
  })
);

app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(__dirname + '/assets', { index: false, maxAge: '30 days' }));
app.use(express.static(__dirname + '/dist', { index: false, maxAge: '1 day', setHeaders: setCustomCacheControl }));

function setCustomCacheControl (res, path) {
  const mimeType = serveStatic.mime.lookup(path);
  if (mimeType === 'image/png' || mimeType === 'image/jpeg') {
    // Custom Cache-Control for images, at one month
    res.setHeader('Cache-Control', 'public, max-age=2592000')
  }
}

app.get('/*', (req, res) => {
  console.time(`GET: ${req.originalUrl}`);
  res.render('./dist/index', {
    req: req,
    res: res
  });
  console.timeEnd(`GET: ${req.originalUrl}`);
});


app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening at ${process.env.PORT || 4000}`)
});
