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

};


/**
 * Нобор контроллеров
 *
 * @attribute controller 
 * @type Object
 */
var controller = {
    index:      require('./controller/index')
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
    res.locals.isDev    = process.env.NODE_ENV !== 'prod';
    res.locals.user     = false;

    res.set('Server', 'shareview');
    res.set('X-Powered-By', 'ISMAX');
    next();
});

// Главная стр.
app.get('/', controller.index.index);

// Sitemap.xml
app.get('/Sitemap.xml', controller.index.sitemap);

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