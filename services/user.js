/**
 * User сервис
 *
 * @module      Service.User
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import crypto from 'crypto';
import validator from 'validator';
import generatePassword from 'password-generator';

const

    /**
     * Создание пользователя
     *
     * @method create
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    create = (req, res, next) => {
        // Если пользователь авторизован
        if (res.locals.user) {
            res.send({ success: false });
            return;
        }

        if (!req.body.email || !validator.isEmail(req.body.email)) {
            next(Error('Validate error - email is invalid'));
            return;
        }

        req.model.user.getUserByEmail(req.body.email).then(user => {
            if (user) {
                res.send({
                    success: false,
                    exist: true,
                });
                return;
            }

            const
                password = generatePassword(12, false),
                data = {
                    email: req.body.email,
                    active: false,
                    address: req.ip,
                };

            // Шифрование
            data.password = crypto.createHmac('sha256', password).digest('hex');
            data.salt = crypto.createHmac(
                'sha256',
                req.body.email
            ).digest('hex');

            /* eslint no-shadow: ["error", { "allow": ["err"] }] */
            return req.model.user.create(data).then(result => {
                res.locals._id = result.insertedId;
                res.locals.email = data.email;
                res.locals.password = password;

                res.render('mail/register', (err, text) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    res.render('mail/register.html', (err, html) => {
                        if (err) {
                            next(err);
                            return;
                        }

                        req.email({
                            to: data.email,
                            subject: 'Регистрация в сервисе SHAREVIEW',
                            text,
                            html,
                        }).then(() => {
                            res.send({ success: true });
                        }).catch(err => {
                            next(err);
                        });
                    });
                });
            });
        }).catch(err => {
            next(err);
        });
    },

    /**
     * Генирация нового паролья (востановления доступа)
     *
     * @method forgot
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    forgot = (req, res, next) => {
        // Если пользователь авторизован
        if (res.locals.user) {
            res.send({ success: false });
            return;
        }

        if (!req.body.email || !validator.isEmail(req.body.email)) {
            next(Error('Validate error - email is invalid'));
            return;
        }

        const
            password = generatePassword(12, false),
            pwd = crypto.createHmac('sha256', password).digest('hex');

        /* eslint no-shadow: ["error", { "allow": ["err"] }] */
        req.model.user.setPasswordByEmail(req.body.email, pwd).then(result => {
            if (!result.mongoResult.result.nModified) {
                res.send({ success: false });
                return;
            }

            res.locals.password = password;

            res.render('mail/forgot', (err, text) => {
                if (err) {
                    next(err);
                    return;
                }

                res.render('mail/forgot.html', (err, html) => {
                    if (err) {
                        next(err);
                        return;
                    }

                    req.email({
                        to: req.body.email,
                        subject: 'Востановления доступа к сервису SHAREVIEW',
                        text,
                        html,
                    }).then(() => {
                        res.send({ success: true });
                    }).catch(err => {
                        next(err);
                    });
                });
            });
        }).catch(err => {
            next(err);
        });
    };

export default {
    create,
    forgot,
};
