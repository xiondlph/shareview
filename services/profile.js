/**
 * Profile сервис
 *
 * @module      Service.Profile
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import crypto from 'crypto';
import validator from 'validator';

const
    // Обновление данных профиля
    updateProfile = (req, res, next, data) => {
        req.model.user.update(res.locals.user._id, data).then(() => {
            res.send({
                success: true,
            });
        }).catch(err => {
            next(err);
        });
    },

    // Проверка дубликатов mail
    isExistByEmail = (req, res) => {
        return req.model.user.getUserByEmail(req.body.email).then(user => {
            return (user && req.body.email !== res.locals.user.email);
        });
    },

    /**
     * Получение данных профиля
     *
     * @method get
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     */
    get = (req, res) => {
        res.send({
            success: true,
            profile: {
                email: res.locals.user.email,
                address: res.locals.user.address,
                key: res.locals.user.salt,
                period: res.locals.user.period,
            },
        });
    },


    /**
     * Сохранение данных профиля
     *
     * @method set
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    set = (req, res, next) => {
        var data = {};

        if (req.body.address) {
            if (!validator.isIP(req.body.address)) {
                next(Error('Validate error - address is invalid'));
                return;
            }

            data.address = req.body.address;
        }

        if (req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                next(Error('Validate error - mail is invalid'));
                return;
            }

            data.email = req.body.email;

            isExistByEmail(req, res).then(exist => {
                if (exist) {
                    res.send({
                        success: false,
                        exist: true,
                    });

                    return;
                }

                updateProfile(req, res, next, data);
            }).catch(err => {
                next(err);
            });

            return;
        }

        updateProfile(req, res, next, data);
    },


    /**
     * Смена текущего пароля
     *
     * @method password
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    password = (req, res, next) => {
        if (!validator.isLength(req.body.password, 1, 255)) {
            next(new Error('Validate error - password is invalid'));
        }

        const pwd = crypto.createHmac('sha256', req.body.password).digest('hex');
        req.model.user.setPasswordId(res.locals.user._id, pwd).then(() => {
            res.send({
                success: true,
            });
        }).catch(err => {
            next(err);
        });
    };

export default {
    get,
    set,
    password,
};
