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
import './exception';
import { init as db } from './db';
import models from './models';
import services from './services';
import utils from './utils';

const
    app = express(),
    logSrv = debug('shareview:server'),
    logHttp = debug('shareview:http'),
    PORT = +process.env.PORT || 3001,

    /* eslint new-cap: ["error", { "capIsNewExceptions": ["Router"] }] */
    apiRoutes = express.Router(),
    userRoutes = express.Router(),

    // TODO: Перенести в ./exception
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
        logHttp(err.stack);
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

    // TODO: Временное решение для CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );

    next();
});

// USER
userRoutes.use(
    models.user,
    services.secure.user
);

// Secure
userRoutes.post('/signin', services.secure.signin);

// User
userRoutes.post('/create', utils.mailer.email, services.user.create);
userRoutes.post('/forgot', utils.mailer.email, services.user.forgot);

// Review
app.get(
    '/review',
    models.user,
    utils.request.api,
    services.secure.access,
    services.review.get
);

// API
apiRoutes.use(
    models.user,
    services.secure.user,
    services.secure.auth
);

// Profile (api)...
apiRoutes.get('/profile', services.profile.get);
apiRoutes.put('/profile', services.profile.set);
apiRoutes.post('/password', services.profile.password);

// применение групп маршрутов
app.use('/user', userRoutes);
app.use('/api', apiRoutes);

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
            logSrv('%s - Listening on port %s', (new Date()).toUTCString(), PORT);
            resolve(server);
        });
    });
});
