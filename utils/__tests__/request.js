/**
 * Тест утилиты Request
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода api', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('Успешное выполнение метода api', done => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('http', () => {
            return {
                request(opt, accept) {
                    const Request = function Request() {
                        const
                            requestEventStack = {},
                            responseEventStack = {};

                        accept({
                            statusCode: 200,
                            on(eventType, cb) {
                                responseEventStack[eventType] = cb;
                            },
                            end() {},
                        });

                        this.on = (eventType, cb) => {
                            requestEventStack[eventType] = cb;
                        };

                        this.end = () => {
                            responseEventStack.data('Simple');
                            responseEventStack.data(' response');
                            responseEventStack.end();
                        };
                    };

                    expect(opt).toHaveProperty('host', '127.0.0.1');
                    expect(opt).toHaveProperty('port', 3000);
                    expect(opt).toHaveProperty('path', 'url');
                    expect(opt).toHaveProperty('method', 'GET');
                    expect(opt).toHaveProperty('headers.Host', 'market.icsystem.ru');
                    expect(opt).toHaveProperty(
                        'headers.X-Ismax-Key',
                        '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f'
                    );
                    expect(opt).toHaveProperty('headers.X-Forwarded-Proto', 'http');
                    expect(opt).toHaveProperty('headers.X-Forwarded-for', '127.0.0.1');

                    return new Request();
                },
            };
        });

        req.headers['x-forwarded-for'] = '127.0.0.1';

        utils.request.api(req, res, () => {
            req.api('url', (err, status, data) => {
                expect(err).toBeNull();
                expect(status).toBe(200);
                expect(data).toBe('Simple response');
                done();
            });
        });
    });

    it('Выполнение метода api с ошибкой', done => {
        const
            utils = require('../index').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse();

        jest.mock('http', () => {
            return {
                request(opt, accept) {
                    const Request = function Request() {
                        const
                            requestEventStack = {},
                            responseEventStack = {};

                        accept({
                            statusCode: 500,
                            on(eventType, cb) {
                                responseEventStack[eventType] = cb;
                            },
                            end() {},
                        });

                        this.on = (eventType, cb) => {
                            requestEventStack[eventType] = cb;
                        };

                        this.end = () => {
                            requestEventStack.error(Error('api.error'));
                        };
                    };

                    return new Request();
                },
            };
        });

        req.headers['x-forwarded-for'] = '127.0.0.1';

        utils.request.api(req, res, () => {
            req.api('url', (err, status, data) => {
                expect(err).toEqual(Error('api.error'));
                expect(status).toBeUndefined();
                expect(data).toBeUndefined();
                done();
            });
        });
    });
});
