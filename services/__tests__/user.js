/**
 * Тест сервиса управления пользователем
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

describe('Тестирование метода create', () => {
    it('Успешное выполнение метода create', (done) => {
        const
            user = require('../user').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        req.model = {
            user: {
                getUserByEmail(email) {
                    expect(email).toEqual('user@simple.com');

                    return new Promise(resolve => {
                        resolve();
                    });
                },

                create(data) {
                    expect(data.email).toEqual('user@simple.com');
                    expect(data.active).toEqual(false);
                    expect(data.address).toEqual('127.0.0.1');
                    expect(data.period).toBeDefined();
                    expect(data.password).toBeDefined();
                    expect(data.salt).toBeDefined();

                    return new Promise(resolve => {
                        resolve({
                            insertedId: 'insertedId',
                        });
                    });
                },
            },
        };

        req.email = (opt) => {
            expect(opt.to).toEqual('user@simple.com');
            expect(opt.subject).toEqual('Регистрация в сервисе SHAREVIEW');
            expect(opt.text).toEqual('Simple text');

            return new Promise(resolve => {
                resolve();
            });
        };

        req.body = {
            email: 'user@simple.com',
        };

        req.ip = '127.0.0.1';
        res.locals = {};

        user.create(req, res, (err) => {
            expect(err).toEqual(null);
            done();
        });


        res.on('render', () => {
            expect(res._getRenderView()).toEqual('mail/register');
            expect(res.locals._id).toEqual('insertedId');
            expect(res.locals.email).toEqual('user@simple.com');
            expect(res.locals.password).toBeDefined();

            res._getRenderData()(null, 'Simple text');
        });

        res.on('send', () => {
            expect(res._getData()).toEqual({ success: true });
            done();
        });
    });
});
