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
    fs.access(`${process.env.APPPATH}/log/`, fs.R_OK | fs.W_OK, (fErr) => {
        if (!fErr) {
            const fd = fs.openSync(`${process.env.APPPATH}/log/payment.log`, 'a');

            fs.writeSync(fd, `${stringifyParams}\n`, null, 'utf8');
            fs.closeSync(fd);
        }
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
     */
    notification = (req, res, next) => {
        var currentPeriod,
            newPeriod,
            hash;

        // Логирование уведомления
        logPayment(req.body);


        // Уведомление о платеже по email
        notice(req, res, next, 'Входящий платеж');
        hash = [
            req.body.notification_type,
            req.body.operation_id,
            req.body.amount,
            req.body.currency,
            req.body.datetime,
            req.body.sender,
            req.body.codepro,
            'DCb7b4n2+RsQEuk5Mw+V3xOx',
            req.body.label,
        ].join('&');
        hash = crypto.createHash('sha1').update(hash).digest('hex');

        if (!req.body.sha1_hash || req.body.sha1_hash !== hash || req.body.codepro !== 'false') {
            console.log('no');
            res.end();
            return;
        }

        req.model.__user.getUserById(
            new req.model.ObjectID(req.body.label)
        ).then(user => {
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

            return req.store.user.updatePeriod(
                user._id,
                newPeriod)
                .then(result => {
                    if (!result.mongoResult.result.nModified) {
                        res.end();
                        return;
                    }

                    req.body._user = result.mongoResult.result.upsertedId;
                    req.body._lastPeriod = currentPeriod;
                    req.body._newPeriod = newPeriod;

                    req.model.__payment.add(req.body);

                    // Уведомление об успешном платеже по email
                    notice(req, res, next, 'Успешный входящий платеж');

                    res.end();
                });
        }).catch(err => {
            next(err);
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
        const
            skip = isNaN(+req.query.skip) ? 0 : +req.query.skip,
            limit = isNaN(+req.query.limit) ? 0 : +req.query.limit;

        req.model.__payment.listById(
            res.locals.user._id,
            skip,
            limit)
            .then(({ payments, count }) => {
                res.send({
                    success: true,
                    payments,
                    total: count,
                });
            }).catch(err => {
                next(err);
            });
    };

export default {
    notification,
    list,
};
