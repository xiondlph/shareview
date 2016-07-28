/**
 * Главный модуль сервера
 *
 * @module      Server
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
import debug from 'debug';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import {init as db} from './db';

const
    app         = express(),
    log         = debug('shareview:server'),
    PORT        = +process.env.PORT || 3000,

    /**
     * Набор моделей
     *
     * @attribute model
     * @type Object
     */
    model = {
        user: require('./models/user'),
        payment: require('./models/payment')
    },

    /**
     * Нобор контроллеров
     *
     * @attribute controller
     * @type Object
     */
    services = {
        user: require('./services/user'),
        secure: require('./services/secure'),
    };

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
    cookie: {secure: false}
}));

app.use((req, res, next) => {
    res.set('Server', 'Shareview');
    res.set('X-Powered-By', 'ISMAX');
    next();
});

app.all('*', model.user, services.secure.user);

app.post('/create', services.user.create);

app.get('/', (req, res) => {
    res.send('OK');
});

// Запуск web сервера на порту 3001/4001
db.then(() => {
    app.listen(PORT,  function () {
        log('Listening on port ' + PORT);
    });
});