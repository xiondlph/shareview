/**
 * Мок для Nodemailer плагина
 */

const
    sendMail = jest.fn()
    /**
     * Регистрация пользователя (/user/create)
     **********************************************/

        /**
         * Успешная регистрация
         */

        // services.user.create (sendMail) => cuccess
        .mockImplementationOnce((options, cb) => {
            cb(null);
        })


        /**
         * Ошибка в sendMail
         */

        // services.user.create (sendMail) => failed
        .mockImplementationOnce((options, cb) => {
            cb(Error('nodemailer error (sendMail)'));
        }),

        // // Сброс пароля (/user/forgot)
        // // Успешный сброс - services.user.forgot (sendMail) => cuccess
        // .mockImplementationOnce((options, cb) => {
        //     cb(null);
        // })
        //
        // // Сброс пароля (/user/forgot)
        // // Ошибка в sendMail - services.user.forgot (sendMail) => failed
        // .mockImplementationOnce((options, cb) => {
        //     cb(Error('nodemailer error (sendMail)'));
        // }),
    nodemailer = {
        createTransport() {
            return {
                sendMail,
            };
        },
    };

export default nodemailer;
