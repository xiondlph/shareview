/**
 * Тест сервиса управления профилем
 */

import httpMocks from 'node-mocks-http';
import EventEmitter from 'events';

describe('Тестирование метода get', () => {
    it('Успешное выполнение метода get', done => {
        const
            profile = require('../profile').default,
            req = httpMocks.createRequest(),
            res = httpMocks.createResponse({
                eventEmitter: EventEmitter,
            });

        res.locals = {
            user: {
                email: 'fake.email',
                address: 'fake.address',
                salt: 'fake.key',
                period: 'fake.period',
            },
        };

        res.on('send', () => {
            expect(res._getData()).toEqual({
                success: true,
                profile: {
                    email: 'fake.email',
                    address: 'fake.address',
                    key: 'fake.key',
                    period: 'fake.period',
                },
            });
            done();
        });

        // Вызов метода get
        profile.get(req, res);
    });
});
