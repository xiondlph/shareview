/**
 * User контроллер
 *
 * @module      Hosts.Base.Controller.User
 * @class       Controller.User
 * @namespace   Hosts.Base
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
var crypto            = require('crypto'),
    nodemailer        = require("nodemailer"),
    validator         = require('validator'),
    generatePassword  = require('password-generator');

//---------------------- HTTP запросы ----------------------//


/**
 * Страница контроллера
 *
 * @method index
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.index = function (req, res) {
    res.render('admin');
};


/**
 * Создание пользователя
 *
 * @method create
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.create = function (req, res, next) {

    // Если пользователь авторизован
    if (res.locals.user) {
        res.send({success: false});
        return;
    }

    if (!validator.isEmail(req.body.email)) {
        throw new Error('Validate error - email is invalid');
    }

    req.model.user.isExistByEmail(req.body.email, function (err, count) {
        var currentDate = new Date(),
            transporter,
            password,
            data;

        if (err) {
            next(err);
            return;
        }

        if (count > 0) {
            res.send({
                success:    false,
                exist:      true
            });

            return;
        }

        password    = generatePassword(12, false);
        data        = {
            email:      req.body.email,
            active:     false,
            address:    req.ip,
            period:     currentDate.setDate(currentDate.getDate() + 1)
        };

        // Шифрование
        data.password   = crypto.createHmac('sha256', password).digest('hex');
        data.salt       = crypto.createHmac('sha256', req.body.email).digest('hex');

        req.model.user.create(data, function (err, user) {

            if (err) {
                next(err);
                return;
            }

            data._id = data._id.toString();
            req.store.user.create(data, function (err, user) {
                if (err) {
                    next(err);
                    return;
                }

                res.locals.email     = data.email;
                res.locals.password  = password;

                res.render('mail/register', function (err, text) {

                    if (err) {
                        next(err);
                        return;
                    }

                    transporter = nodemailer.createTransport({
                        service: 'Mail.ru',
                        auth: {
                            user: 'notification@shareview.ru',
                            pass: '159753QwErT'
                        }
                    });

                    transporter.sendMail({
                        from: 'SHAREVIEW <notification@shareview.ru>',
                        to: data.email,
                        subject: 'Регистрация в сервисе SHAREVIEW',
                        text: text,
                        headers: {
                            'X-Mailer': 'SHAREVIEW'
                        },
                        localAddress: '194.87.197.55'
                    }, function (err, response) {
                        if (err) {
                            next(err);
                            return;
                        }

                        res.send({success: true});
                    });
                });
            });
        });
    });
};


/**
 * Генирация нового паролья (востановления доступа)
 *
 * @method forgot
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.forgot = function (req, res, next) {

    // Если пользователь авторизован
    if (res.locals.user) {
        res.send({success: false});
        return;
    }

    if (!validator.isEmail(req.body.email)) {
        throw new Error('Validate error - email is invalid');
    }

    req.model.user.getUserByEmail(req.body.email, function (err, user) {
        var transporter,
            password;

        if (err) {
            next(err);
            return;
        }

        if (!user) {
            res.send({success: false});
            return;
        }

        password = generatePassword(12, false);

        req.model.user.setPasswordByEmail(req.body.email, crypto.createHmac('sha256', password).digest('hex'), function (err, result) {

            if (err) {
                next(err);
                return;
            }

            req.store.user.setPasswordByEmail(req.body.email, crypto.createHmac('sha256', password).digest('hex'), function (err, result) {
                if (err) {
                    next(err);
                    return;
                }

                res.locals.password = password;

                res.render('mail/forgot', function (err, text) {

                    if (err) {
                        next(err);
                        return;
                    }

                    transporter = nodemailer.createTransport({
                        service: 'Mail.ru',
                        auth: {
                            user: 'notification@shareview.ru',
                            pass: '159753QwErT'
                        }
                    });

                    transporter.sendMail({
                        from: 'SHAREVIEW <notification@shareview.ru>',
                        to: user.email,
                        subject: 'Востановления доступа к сервису SHAREVIEW',
                        text: text,
                        headers: {
                            'X-Mailer': 'SHAREVIEW'
                        },
                        localAddress: '194.87.197.55'
                    }, function (err, response) {
                        if (err) {
                            next(err);
                            return;
                        }

                        res.send({success: true});
                    });
                });
            });
        });
    });
};


/**
 * Синхронизация данных пользователя в NeDB с MongoDB
 *
 * @method sync
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.sync = function (req, res, next) {
    req.store.user.sync(res.locals.user._id, function (err, user) {
        if (err) {
            next(err);
            return;
        }

        res.locals.user = user.value;
        next();
    });
};
