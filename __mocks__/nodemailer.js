/**
 * Мок для Nodemailer плагина
 */

const
    nodemailer = {
        createTransport() {
            return {
                sendMail(options, cb) {
                    if (options.to === 'sendmail@nodemailer.error') {
                        cb(Error('nodemailer error (sendMail)'));
                        return;
                    }

                    cb(null);
                },
            };
        },
    };

export default nodemailer;
