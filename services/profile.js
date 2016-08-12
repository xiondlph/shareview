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

// Обновление данных профиля
function updateProfile(req, res, next, data) {
    req.model.user.update(res.locals.user._id, data, (err) => {
        if (err) {
            next(err);
            return;
        }

        req.model.user.sync(res.locals.user._id, (err) => {
            if (err) {
                next(err);
                return;
            }

            res.send({
                success: true,
            });
        });
    });
}


// Проверка дубликатов mail
function isExistByEmail(req, res, next, accept) {
    req.model.user.isExistByEmail(req.body.email, (err, count) => {
        if (err) {
            next(err);
            return;
        }

        if (count > 0 && req.body.email !== res.locals.user.email) {
            accept(true); // Дубликат
        } else {
            accept(false); // Уникальный
        }
    });
}


const

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
                next(new Error('Validate error - address is invalid'));
                return;
            }

            data.address = req.body.address;
        }

        if (req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                next(new Error('Validate error - mail is invalid'));
                return;
            }

            data.email = req.body.email;

            isExistByEmail(req, res, next, (exist) => {
                if (exist) {
                    res.send({
                        success: false,
                        exist: true,
                    });

                    return;
                }

                updateProfile(req, res, next, data);
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
        req.model.user.setPasswordId(res.locals.user._id, pwd, (err) => {
            if (err) {
                next(err);
                return;
            }

            res.send({
                success: true,
            });
        });
    };

export default {
    get,
    set,
    password,
};
