/**
 * Payment сервис
 *
 * @module      Payment
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


// Объявление модулей
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import fs from 'fs';


// Логирование уведоблений об оплате
function logPayment(params) {
    const stringifyParams = JSON.stringify(params, null, '\t');

    // Запись данных уведобления в лог файл
    fs.open(`${process.env.APPPATH}/log/payment.log`, 'a', (e, id) => {
        fs.write(id, `${stringifyParams}\n`, null, 'utf8', () => {
            fs.close(id);
        });
    });
}


// Отправка оповещения о платеже
function notice(req, res, next, subject) {
    var transporter = nodemailer.createTransport({
        service: 'Mail.ru',
        auth: {
            user: 'notification@shareview.ru',
            pass: 'XtFyKBXeChHY',
        },
    });

    transporter.sendMail({
        from: 'SHAREVIEW <notification@shareview.ru>',
        to: 'SHAREVIEW ISMAX <support@shareview.ru>',
        subject,
        text: JSON.stringify(req.body, null, '\t'),
        headers: {
            'X-Mailer': 'SHAREVIEW',
        },
    }, (err) => {
        if (err) {
            next(new Error(`Notice send error - ${err.message}`));
        }
    });
}

// Формирование периода в timestamp
function getPeriod(currentPeriod, currentDate, amount) {
    var _currentDate = new Date(currentDate),
        _currentPeriod = currentPeriod &&
            currentPeriod > _currentDate ? new Date(currentPeriod) : _currentDate;

    switch (amount) {
        case 50:
            _currentPeriod.setDate(_currentPeriod.getDate() + 1);
            break;
        case 500:
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 1);
            break;
        case 1000:
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 2);
            break;
        case 1500:
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 3);
            break;
        case 2000:
            _currentPeriod.setMonth(_currentPeriod.getMonth() + 4);
            break;
        default:
            _currentPeriod.setDate(
                _currentPeriod.getDate() + (Math.ceil(amount / 50))
            );
            break;
    }

    return _currentPeriod.valueOf();
}

const
    /**
     * Уведомление о платеже
     *
     * @method notification
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     * .0
     */
    notification = (req, res, next) => {
        var currentPeriod,
            newPeriod,
            hash;

        // Логирование уведомления
        logPayment(req.body);


        // Уведомление о платеже по email
        notice(req, res, next, 'Входящий платеж');

        hash = `${req.body.notification_type}&${req.body.operation_id}&${req.body.amount}&${req.body.currency}&${req.body.datetime}&${req.body.sender}&${req.body.codepro}&DCb7b4n2+RsQEuk5Mw+V3xOx&${req.body.label}`;
        hash = crypto.createHash('sha1').update(hash).digest('hex');

        if (req.body.sha1_hash !== hash || req.body.codepro !== 'false') {
            res.end();
            return;
        }

        req.model.user.getUserById(
            new req.model.ObjectID(req.body.label),
            (err, user) => {
                if (err) {
                    next(err);
                    return;
                }

                if (!user) {
                    res.end();
                    return;
                }

                currentPeriod = user.period;
                newPeriod = getPeriod(
                    currentPeriod,
                    req.body.datetime,
                    req.body.withdraw_amount
                );

                req.store.user.updatePeriod(
                    user._id,
                    newPeriod,
                    (err, result) => {
                        if (err) {
                            next(err);
                            return;
                        }

                        if (!result) {
                            res.end();
                            return;
                        }

                        req.store.user.sync(user._id, (err, result) => {
                            if (err) {
                                next(err);
                                return;
                            }

                            if (!user.value) {
                                res.end();
                                return;
                            }

                            req.body._user = result.value._id;
                            req.body._lastPeriod = currentPeriod;
                            req.body._newPeriod = newPeriod;

                            req.model.payment.add(req.body);

                            // Уведомление об успешном платеже по email
                            notice(req, res, next, 'Успешный входящий платеж');

                            res.end();
                        });
                    });
            });
    },


    /**
     * Получение списка уведомлений пользователя по email пользователя
     *
     * @method list
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    list = (req, res, next) => {
        var skip = req.query.start,
            limit = req.query.limit;

        req.model.payment.listByEmail(
            res.locals.user.email,
            skip,
            limit,
            (err, payments, count) => {
                if (err) {
                    next(err);
                    return;
                }

                res.send({
                    success: true,
                    payments,
                    total: count,
                });
            });
    };

export default {
    notification,
    list,
};
