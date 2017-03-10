/**
 * Тест утилиты Request
 */

import httpMocks from 'node-mocks-http';

describe('Тестирование метода api', () => {
    it('Успешное выполнение метода api', (done) => {
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
                            if (
                                opt.port !== 3000 ||
                                opt.path !== 'url' ||
                                opt.method !== 'GET' ||
                                !opt.headers ||
                                opt.headers.Host !== 'market.icsystem.ru' ||
                                opt.headers['X-Ismax-Key'] !== '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f' ||
                                opt.headers['X-Forwarded-Proto'] !== 'http' ||
                                opt.headers['X-Forwarded-for'] !== '127.0.0.1'
                            ) {
                                requestEventStack.error(Error('Request options invalid'));
                            } else {
                                responseEventStack.data('Simple');
                                responseEventStack.data(' response');
                                responseEventStack.end();
                            }
                        };
                    };

                    return new Request();
                },
            };
        });

        req.headers['x-forwarded-for'] = '127.0.0.1';

        utils.request.api(req, res, () => {
            req.api('url', (err, status, data) => {
                expect(err).toEqual(null);
                expect(status).toEqual(200);
                expect(data).toEqual('Simple response');
                done();
            });
        });
    });

    it('Выполнение метода apiс ошибкой', (done) => {
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
                            if (
                                opt.port !== 3000 ||
                                opt.path !== 'url' ||
                                opt.method !== 'GET' ||
                                !opt.headers ||
                                opt.headers.Host !== 'market.icsystem.ru' ||
                                opt.headers['X-Ismax-Key'] !== '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f' ||
                                opt.headers['X-Forwarded-Proto'] !== 'http' ||
                                opt.headers['X-Forwarded-for'] !== '127.0.0.1'
                            ) {
                                requestEventStack.error(Error('Request options invalid'));
                            } else {
                                requestEventStack.error(Error('api - error'));
                            }
                        };
                    };

                    return new Request();
                },
            };
        });

        req.headers['x-forwarded-for'] = '127.0.0.1';

        utils.request.api(req, res, () => {
            req.api('url', (err, status, data) => {
                expect(err.message).toEqual('api - error');
                expect(status).toBeUndefined();
                expect(data).toBeUndefined();
                done();
            });
        });
    });
});
