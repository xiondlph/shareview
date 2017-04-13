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
         * @param {String} from
         * @param {String} to
         * @param {String} subject
         * @param {String} text
         * @param {String} html
         * @returns {Promise}
         */
        req.email = ({
            from = 'SHAREVIEW <notification@shareview.ru>',
            to,
            subject,
            text,
            html,
            }) => {
            return new Promise((resolve, reject) => {
                transporter.sendMail({
                    from,
                    to,
                    subject,
                    text,
                    html,
                    headers: {
                        'X-Mailer': 'SHAREVIEW',
                    },
                    attachments: [{
                        filename: 'logo.png',
                        path: `${process.env.APPPATH}/resources/images/logo.png`,
                        cid: 'shareview.logo',
                    }],
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
