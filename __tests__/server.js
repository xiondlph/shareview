import supertest from 'supertest';
import http from '../server';

jest.mock('../db');

describe('Запросы к API - ', () => {
    afterEach(() => {
        http.then((server) => {
            server.close();
        });
    });

    it('/', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .get('/api/profile')
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).catch(
            err => { expect(err).toEqual(null); }
        );
    });
});
