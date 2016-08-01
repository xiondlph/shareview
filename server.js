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
import models from './models';
import services from './services';

const
    app         = express(),
    log         = debug('shareview:server'),
    PORT        = +process.env.PORT || 3000;

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

app.all('*', models.user, services.secure.user);

app.post('/create', services.user.create);

app.get('/', (req, res) => {
    test();
    res.send('OK');
});

// 404 (Not found)
app.use((req, res) => {
    res.status(404).send({errors: ["Not found"]});
});

// 500 (Internal server error)
app.use((err, req, res, next) => {
    res.status(500).send({errors: ["Internal server error"]});
    log(err);
});

// Запуск web сервера на порту 3001/4001
db.then(() => {
    app.listen(PORT,  function () {
        log('Listening on port ' + PORT);
    });
});