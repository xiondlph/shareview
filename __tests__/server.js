/**
 * Тест регистрации пользователя
 */

import supertest from 'supertest';
import http from '../server';

jest.mock('../exception');
jest.mock('../db');

const request = http.then(server => {
    return supertest.agent(server);
});

describe('Регистрация пользователя (/user/create) - ', () => {
    it('Успешная регистрация', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'user@test.ru' })
                    .set('Cookie', 'is_authorized')
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.success).toEqual(true); }
        );
    });
});
