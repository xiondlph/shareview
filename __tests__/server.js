import supertest from 'supertest';
import http from '../server';

jest.mock('nedb');
jest.mock('../db');

describe('Запросы к API - ', () => {
    afterEach(() => {
        http.then((server) => {
            server.close();
        });
    });

    it('/user/create', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'test@test.ru' })
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
            res => { console.log(res); }
        ).catch(
            err => { expect(err).toEqual(null); }
        );
    });
});
