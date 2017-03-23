/**
 * Тест утилиты Mailer
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода email', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода email', (done) => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();


        jest.mock('nodemailer', () => {
            return {
                /* eslint no-shadow: ["error", { "allow": ["opt"] }] */
                createTransport(opt) {
                    if (!opt.auth) {
                        throw new Error('email.createTransport opt property invalid "auth"');
                    }

                    if (opt.auth.user !== 'notification@shareview.ru') {
                        throw new Error('email.createTransport opt property invalid "auth.user"');
                    }

                    if (opt.auth.pass !== 'XtFyKBXeChHY') {
                        throw new Error('email.createTransport opt property invalid "auth.pass"');
                    }

                    return {
                        sendMail(opt, cb) {
                            if (opt.from !== 'SHAREVIEW <notification@shareview.ru>') {
                                throw new Error('email.sendMail opt property invalid "from"');
                            }

                            if (opt.to !== 'user@simple.com') {
                                throw new Error('email.sendMail opt property invalid "to"');
                            }

                            if (opt.subject !== 'Simple subject') {
                                throw new Error('email.sendMail opt property invalid "subject"');
                            }

                            if (opt.text !== 'Simple text') {
                                throw new Error('email.sendMail opt property invalid "text"');
                            }

                            if (!opt.headers) {
                                throw new Error('email.sendMail opt property invalid "headers"');
                            }

                            if (opt.headers['X-Mailer'] !== 'SHAREVIEW') {
                                throw new Error('email.sendMail opt property invalid "headers[X-Mailer]"');
                            }

                            if (opt.localAddress !== '194.87.197.55') {
                                throw new Error('email.sendMail opt property invalid "localAddress');
                            }

                            cb();
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
                expect(err.message).toEqual(null);
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
                    if (!opt.auth) {
                        throw new Error('email.createTransport opt property invalid "auth"');
                    }

                    if (opt.auth.user !== 'notification@shareview.ru') {
                        throw new Error('email.createTransport opt property invalid "auth.user"');
                    }

                    if (opt.auth.pass !== 'XtFyKBXeChHY') {
                        throw new Error('email.createTransport opt property invalid "auth.pass"');
                    }

                    return {
                        sendMail(opt, cb) {
                            if (opt.from !== 'SHAREVIEW <notification@shareview.ru>') {
                                throw new Error('email.sendMail opt property invalid "from"');
                            }

                            if (opt.to !== 'user@simple.com') {
                                throw new Error('email.sendMail opt property invalid "to"');
                            }

                            if (opt.subject !== 'Simple subject') {
                                throw new Error('email.sendMail opt property invalid "subject"');
                            }

                            if (opt.text !== 'Simple text') {
                                throw new Error('email.sendMail opt property invalid "text"');
                            }

                            if (!opt.headers) {
                                throw new Error('email.sendMail opt property invalid "headers"');
                            }

                            if (opt.headers['X-Mailer'] !== 'SHAREVIEW') {
                                throw new Error('email.sendMail opt property invalid "headers[X-Mailer]"');
                            }

                            if (opt.localAddress !== '194.87.197.55') {
                                throw new Error('email.sendMail opt property invalid "localAddress');
                            }

                            cb(Error('email.error'));
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
                expect(err.message).toEqual('email.error');
                done();
            });
        });
    });
});
