/**
 * Тест утилиты Mailer
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода email', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода email', done => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();


        jest.mock('nodemailer', () => {
            return {
                /* eslint no-shadow: ["error", { "allow": ["opt"] }] */
                createTransport(opt) {
                    expect(opt).toHaveProperty('auth.user', 'notification@shareview.ru');
                    expect(opt).toHaveProperty('auth.pass', 'XtFyKBXeChHY');

                    return {
                        sendMail(opt, cb) {
                            expect(opt).toHaveProperty('from', 'SHAREVIEW <notification@shareview.ru>');
                            expect(opt).toHaveProperty('to', 'fake@user.com');
                            expect(opt).toHaveProperty('subject', 'Simple subject');
                            expect(opt).toHaveProperty('text', 'Simple text');
                            expect(opt).toHaveProperty('headers.X-Mailer', 'SHAREVIEW');
                            expect(opt).toHaveProperty('localAddress', '194.87.197.55');

                            cb();
                        },
                    };
                },
            };
        });

        utils.mailer.email(req, res, () => {
            req.email({
                to: 'fake@user.com',
                subject: 'Simple subject',
                text: 'Simple text',
            }).then(() => {
                done();
            }).catch(err => {
                expect(err).toBeNull();
                done();
            });
        });
    });

    it('Выполнение метода email с ошибкой', done => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();


        jest.mock('nodemailer', () => {
            return {
                createTransport() {
                    return {
                        sendMail(opt, cb) {
                            cb(Error('email.error'));
                        },
                    };
                },
            };
        });

        utils.mailer.email(req, res, () => {
            req.email({
                to: 'fake@user.com',
                subject: 'Simple subject',
                text: 'Simple text',
            }).catch(err => {
                expect(err).toEqual(Error('email.error'));
                done();
            });
        });
    });
});
