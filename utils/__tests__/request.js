/**
 * Тест утилиты Request
 */

import httpMocks from 'node-mocks-http';

/* eslint max-len: ["error", 130] */
describe('Тестирование метода api', () => {
    beforeEach(() => {
        jest.resetModules();
    });

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
                            responseEventStack.data('Simple');
                            responseEventStack.data(' response');
                            responseEventStack.end();
                        };
                    };

                    if (opt.host !== '127.0.0.1') {
                        throw new Error('api.request.error opt property invalid "host"');
                    }

                    if (opt.port !== 3000) {
                        throw new Error('api.request.error opt property invalid "port"');
                    }

                    if (opt.path !== 'url') {
                        throw new Error('api.request.error opt property invalid "path"');
                    }

                    if (opt.method !== 'GET') {
                        throw new Error('api.request.error opt property invalid "method"');
                    }

                    if (!opt.headers) {
                        throw new Error('api.request.error opt property invalid "headers"');
                    }

                    if (opt.headers.Host !== 'market.icsystem.ru') {
                        throw new Error('api.request.error opt property invalid "headers.Host"');
                    }

                    if (opt.headers['X-Ismax-Key'] !== '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f') {
                        throw new Error('api.request.error opt property invalid "headers[X-Ismax-Key]"');
                    }

                    if (opt.headers['X-Forwarded-Proto'] !== 'http') {
                        throw new Error('api.request.error opt property invalid "headers[X-Forwarded-Proto]"');
                    }

                    if (opt.headers['X-Forwarded-for'] !== '127.0.0.1') {
                        throw new Error('api.request.error opt property invalid "headers[X-Forwarded-for]"');
                    }

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

    it('Выполнение метода api с ошибкой', (done) => {
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

                    if (opt.host !== '127.0.0.1') {
                        throw new Error('api.request.error opt property invalid "host"');
                    }

                    if (opt.port !== 3000) {
                        throw new Error('api.request.error opt property invalid "port"');
                    }

                    if (opt.path !== 'url') {
                        throw new Error('api.request.error opt property invalid "path"');
                    }

                    if (opt.method !== 'GET') {
                        throw new Error('api.request.error opt property invalid "method"');
                    }

                    if (!opt.headers) {
                        throw new Error('api.request.error opt property invalid "headers"');
                    }

                    if (opt.headers.Host !== 'market.icsystem.ru') {
                        throw new Error('api.request.error opt property invalid "headers.Host"');
                    }

                    if (opt.headers['X-Ismax-Key'] !== '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f') {
                        throw new Error('api.request.error opt property invalid "headers[X-Ismax-Key]"');
                    }

                    if (opt.headers['X-Forwarded-Proto'] !== 'http') {
                        throw new Error('api.request.error opt property invalid "headers[X-Forwarded-Proto]"');
                    }

                    if (opt.headers['X-Forwarded-for'] !== '127.0.0.1') {
                        throw new Error('api.request.error opt property invalid "headers[X-Forwarded-for]"');
                    }

                    return new Request();
                },
            };
        });

        req.headers['x-forwarded-for'] = '127.0.0.1';

        utils.request.api(req, res, () => {
            req.api('url', (err, status, data) => {
                expect(err.message).toEqual('api.error');
                expect(status).toBeUndefined();
                expect(data).toBeUndefined();
                done();
            });
        });
    });
});
