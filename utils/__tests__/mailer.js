/**
 * Тест утилиты Mailer
 */

import httpMocks from 'node-mocks-http';

describe('Тестирование метода email', () => {
    it('Успешное выполнение метода email', (done) => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();


        jest.mock('nodemailer', () => {
            return {
                /* eslint no-shadow: ["error", { "allow": ["opt"] }] */
                createTransport(opt) {
                    if (
                        !opt.auth ||
                        opt.auth.user !== 'notification@shareview.ru' ||
                        opt.auth.pass !== 'XtFyKBXeChHY'
                    ) {
                        throw Error('createTransport options invalid');
                    }

                    return {
                        sendMail(opt, cb) {
                            if (
                                opt.from !== 'SHAREVIEW <notification@shareview.ru>' ||
                                opt.to !== 'user@simple.com' ||
                                opt.subject !== 'Simple subject' ||
                                opt.text !== 'Simple text' ||
                                !opt.headers || opt.headers['X-Mailer'] !== 'SHAREVIEW' ||
                                opt.localAddress !== '194.87.197.55'
                            ) {
                                cb(Error('sendMail options invalid'));
                            } else {
                                cb();
                            }
                        },
                    };
                },
            };
        });

        utils.mailer.email(req, res, () => {
            req.email({
                to: 'user@simple.com',
                subject: 'Simple subject',
                text: 'Simple text',
            }).then(() => {
                done();
            }).catch((err) => {
                expect(err).toEqual(null);
                done();
            });
        });
    });

    it('Выполнение метода email с ошибкой', (done) => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();


        jest.mock('nodemailer', () => {
            return {
                /* eslint no-shadow: ["error", { "allow": ["opt"] }] */
                createTransport(opt) {
                    if (
                        !opt.auth ||
                        opt.auth.user !== 'notification@shareview.ru' ||
                        opt.auth.pass !== 'XtFyKBXeChHY'
                    ) {
                        throw Error('createTransport options invalid');
                    }

                    return {
                        sendMail(opt, cb) {
                            if (
                                opt.from !== 'SHAREVIEW <notification@shareview.ru>' ||
                                opt.to !== 'user@simple.com' ||
                                opt.subject !== 'Simple subject' ||
                                opt.text !== 'Simple text' ||
                                !opt.headers || opt.headers['X-Mailer'] !== 'SHAREVIEW' ||
                                opt.localAddress !== '194.87.197.55'
                            ) {
                                cb(Error('sendMail options invalid'));
                            } else {
                                cb(Error('sendMail error'));
                            }
                        },
                    };
                },
            };
        });

        utils.mailer.email(req, res, () => {
            req.email({
                to: 'user@simple.com',
                subject: 'Simple subject',
                text: 'Simple text',
            }).catch((err) => {
                expect(err.message).toEqual('sendMail error');
                done();
            });
        });
    });
});
