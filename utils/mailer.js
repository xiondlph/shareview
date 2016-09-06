/**
 * Mailer утилита
 *
 * @module      Util.Mailer
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */

// Объявление модулей
import nodemailer from 'nodemailer';

const
    // Транспортер отправки сееобщений (Mail.ru)
    transporter = nodemailer.createTransport({
        service: 'Mail.ru',
        auth: {
            user: 'notification@shareview.ru',
            pass: 'XtFyKBXeChHY',
        },
    }),

    /**
     * Отправка сообщения по Email
     *
     * @method email
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    email = (req, res, next) => {
        /**
         * Выполенение отправки сообщения по Email
         *
         * @method email
         * @param {Object} options
         */
        req.email = ({
            from = 'SHAREVIEW <notification@shareview.ru>',
            to,
            subject,
            text,
            }) => {
            return new Promise((resolve, reject) => {
                transporter.sendMail({
                    from,
                    to,
                    subject,
                    text,
                    headers: {
                        'X-Mailer': 'SHAREVIEW',
                    },
                    localAddress: '194.87.197.55',
                }, (err) => {
                    if (err) {
                        reject(err);
                    }

                    resolve();
                });
            });
        };

        next();
    };

export default {
    email,
};
