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
import fs from 'fs';
import exception from './exception';
import { init as db } from './db';
import models from './models';
import services from './services';
import utils from './utils';

const
    app = express(),
    log = debug('shareview:server'),
    PORT = +process.env.PORT || 3001,
    logError = err => {
        // err.stack.message = `httpException: ${err.stack.message}`;

        fs.access(`${process.env.APPPATH}/log/`, fs.R_OK | fs.W_OK, (fErr) => {
            if (!fErr) {
                // Запись стека ошибки в лог файл
                const fd = fs.openSync(`${process.env.APPPATH}/log/error.log`, 'a');

                fs.writeSync(fd, `${JSON.stringify(err.stack, null, '\t')}\n`, null, 'utf8');
                fs.closeSync(fd);
            }
        });

        // Вывод стека ошибок в stdout
        log(err.stack);
    };

// Настройка шаблонизатора
app.set('views', `${process.env.APPPATH}/views/`);
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
    cookie: { secure: false },
}));

app.use((req, res, next) => {
    res.set('Server', 'Shareview');
    res.set('X-Powered-By', 'ISMAX');
    next();
});

app.all('*', models.user, models.__user, services.secure.user);

// Secure
app.post('/user/signin', services.secure.signin);
app.get('/user/signout', services.secure.signout);

// User
app.post('/user/create', services.user.create);
app.post('/user/forgot', services.user.forgot);

// Review
app.get('/review', utils.request.api, services.review.get);

// API
app.all('/api/*', services.secure.auth);

// Profile (api)...
app.get('/api/profile', services.profile.get);
app.put('/api/profile', services.profile.set);
app.post('/api/password', services.profile.password);

// Payment (api)...
app.get('/api/payment', models.payment, models.__payment, services.payment.list);

// Обработка запроса уведовления от ЯД
app.post('/ym_notification', models.payment, services.payment.notification);

// 404 (Not found)
app.use((req, res) => {
    res.status(404).send({ errors: ['Not found'] });
});

// 500 (Internal server error)
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send({ errors: ['Internal server error'] });
    logError(err);
});

export default new Promise((resolve) => {
    // Запуск web сервера на порту 3001/4001
    db.then(() => {
        const server = app.listen(PORT, () => {
            log(`Listening on port ${PORT}`);
            resolve(server);
        });
    });
});
