/**
 * Мок для Nodemailer плагина
 */

const
    nodemailer = jest.fn()
        // Регистрация пользователя (/user/create)
        // Успешная регистрация - services.user.create (sendMail) => cuccess
        .mockImplementationOnce({
            createTransport() {
                return {
                    sendMail(options, cb) {
                        cb(null);
                    },
                };
            },
        })

        // Регистрация пользователя (/user/create)
        // Успешная регистрация - services.user.create (sendMail) => failed
        .mockImplementationOnce({
            createTransport() {
                return {
                    sendMail(options, cb) {
                        cb(Error('nodemailer error (sendMail)'));
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Успешный сброс - services.user.forgot (sendMail) => cuccess
        .mockImplementation({
            createTransport() {
                return {
                    sendMail(options, cb) {
                        cb(null);
                    },
                };
            },
        })

        // Сброс пароля (/user/forgot)
        // Ошибка в sendMail - services.user.forgot (sendMail) => cuccess
        .mockImplementationOnce({
            createTransport() {
                return {
                    sendMail(options, cb) {
                        cb(null);
                    },
                };
            },
        });

export default nodemailer;
