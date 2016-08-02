/**
 * User сервис
 *
 * @module      Service.User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import crypto from 'crypto';
import nodemailer from "nodemailer";
import validator from 'validator';
import generatePassword from 'password-generator';

const

    /**
     * Создание пользователя
     *
     * @method create
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    create = (req, res, next) => {

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
                                pass: 'XtFyKBXeChHY'
                            }
                        });

                        transporter.sendMail({
                            from: 'SHAREVIEW <notification@shareview.ru>',
                            to: data.email,
                            subject: 'Регистрация в сервисе SHAREVIEW',
                            text: text,
                            headers: {
                                'X-Mailer': 'SHAREVIEW'
                            }
                            //localAddress: '194.87.197.55'
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
    },

    /**
     * Генирация нового паролья (востановления доступа)
     *
     * @method forgot
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    forgot = (req, res, next)  => {
        var transporter,
            password;

        // Если пользователь авторизован
        if (res.locals.user) {
            res.send({success: false});
            return;
        }

        if (!validator.isEmail(req.body.email)) {
            throw new Error('Validate error - email is invalid');
        }

        password = generatePassword(12, false);

        req.model.user.setPasswordByEmail(req.body.email, crypto.createHmac('sha256', password).digest('hex'), function (err, result) {

            if (err) {
                next(err);
                return;
            }

            if (!result.result.nModified) {
                res.send({success: false});
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
                        pass: 'XtFyKBXeChHY'
                    }
                });

                transporter.sendMail({
                    from: 'SHAREVIEW <notification@shareview.ru>',
                    to: req.body.email,
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
    },

    /**
     * Синхронизация данных пользователя в NeDB с MongoDB
     *
     * @method sync
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    sync = (req, res, next) => {
        req.store.user.sync(res.locals.user._id, (err, user) => {
            if (err) {
                next(err);
                return;
            }

            res.locals.user = user.value;
            next();
        });
    };

export default {
    create,
    forgot,
    sync
};