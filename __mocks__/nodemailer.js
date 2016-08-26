/**
 * Мок для Nodemailer плагина
 */

const
    nodemailer = {
        createTransport() {
            return {
                sendMail(options, cb) {
                    if (
                        options.to === 'user.create@nodemailer.sendmail.error.test'
                        || options.to === 'user.forgot@nodemailer.sendmail.error.test'
                    ) {
                        cb(Error('nodemailer error (sendMail)'));
                        return;
                    }

                    cb(null);
                },
            };
        },
    };

export default nodemailer;
