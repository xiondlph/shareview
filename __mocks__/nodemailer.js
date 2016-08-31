/**
 * Мок для Nodemailer плагина
 */

const
    nodemailer = {
        createTransport() {
            return {
                sendMail(options, cb) {
                    if (options.to === 'nodemailer.sendmail.error@email.ru') {
                        cb(Error('nodemailer error (sendMail)'));
                    }

                    cb(null);
                },
            };
        },
    };

export default nodemailer;
