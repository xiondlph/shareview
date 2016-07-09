/**
 * Модуль инициализации хоста
 *
 * @module      Hosts.Base
 * @class       Base
 * @namespace   Hosts
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


 // Объявление модулей
var express     = require('express'),
    bodyParser  = require('body-parser'),
    session     = require('express-session'),
    debug       = require('debug')('express:shareview:base'),
    fs          = require('fs'),
    app         = express();

/**
 * Набор моделей
 *
 * @attribute model 
 * @type Object
 */
var model = {
    user:       require(__dirname + '/../../model/user'),
    payment:    require(__dirname + '/../../model/payment')
};


/**
 * Нобор контроллеров
 *
 * @attribute controller 
 * @type Object
 */
var controller = {
    index:      require('./controller/index'),
    secure:     require('./controller/secure'),
    user:       require('./controller/user'),
    profile:    require('./controller/profile'),
    payment:    require('./controller/payment'),
    request:    require('./controller/request'),
    review:     require('./controller/review')
};

// Метод записи стека ошибки в лог файл
function logError(err) {
    err.stack.message = 'httpException: ' + err.stack.message;
    fs.open(__dirname + '/../../log/error.log', 'a', function (e, id) {
        fs.write(id, JSON.stringify(err.stack, null, "\t") + "\n", null, 'utf8', function () {
            fs.close(id);
        });
    });
    debug(err.stack);
}

// Настройка шаблонизатора
app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('trust proxy', 1);

// Настройка сессии
app.use(session({
    secret: 'shareview.ismax',
    name: 'shareview.sid',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));

app.use(function (req, res, next) {
    if (!req.secure) {
        return res.redirect('https://' + req.headers.host + req.url);
    }

    res.locals.isDev    = process.env.NODE_ENV !== 'prod';
    res.locals.user     = false;

    res.set('Server', 'shareview');
    res.set('X-Powered-By', 'ISMAX');
    next();
});

//app.all('*', model.user, controller.secure.user);

// Главная стр.
app.get('/', controller.index.index);

// Sitemap.xml
app.get('/Sitemap.xml', controller.index.sitemap);

// Secure
app.get('/user', controller.secure.index);
app.post('/user/signin', controller.secure.signin);
app.get('/user/signout', controller.secure.signout);

// User
app.post('/user/create', controller.user.create);
app.post('/user/forgot', controller.user.forgot);

// Admin dashboard
app.get('/admin', controller.secure.auth, controller.user.index);

// API
app.all('/api/*', controller.secure.auth);

// Review
app.get('/review', controller.request.api, controller.review.get);

// Profile (api)...
app.get('/api/profile', controller.user.sync, controller.profile.get);
app.put('/api/profile', controller.profile.set);
app.post('/api/password', controller.profile.password);

// Payment (api)...
//app.get('/api/payment', model.payment, controller.payment.list);

// Обработка запроса уведовления от ЯД
//app.post('/ym_notification', model.payment, controller.payment.notification);

// Стр. 404 (Not found)
app.use(controller.index.notfound);

// Ответ об ошибке
app.use(function (err, req, res, next) {
    res.render('500');
    logError(err);
});

app.use(function (err, req, res, next) {
    res.status(500).send([
        '<!DOCTYPE HTML>',
        '<html>',
        '<head>',
        '    <title>500 - Internal server error</title>',
        '</head>',
        '<body>',
        '    <h1>Internal server error</h1>',
        '    <p>Произошла внутренняя ошибка, возможно это связано с тем, что сервис сейчас перегружен запросами.<br />Стоит попробовать подождать и повторить операцию, либо перейти на другую страницу.</p>',
        '    <hr />',
        '    <p><i>SHAREVIEW (Ismax) Server at shareview.ru Port 80</i></p>',
        '</body>',
        '</html>'
    ].join('\n'));
    logError(err);
});

exports.app = app;