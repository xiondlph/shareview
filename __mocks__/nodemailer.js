const
    nodemailer = {
        createTransport() {
            return {
                sendMail(options, cb) {
                    if (options.to === 'sendmail@error.ru') {
                        cb(Error('nodemailer error (sendMail)'));
                        return;
                    }

                    cb(null);
                },
            };
        },
    };

export default nodemailer;
