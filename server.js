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

app.get('/', (req, res) => {
    res.send('OK');
});

// Запуск web сервера на порту 3001/4001
db.then(() => {
    app.listen(PORT,  function () {
        log('Listening on port ' + PORT);
    });
});