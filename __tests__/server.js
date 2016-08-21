import supertest from 'supertest';
import http from '../server';

jest.mock('../db');
// jest.mock('ejs');

describe('Запросы к API - ', () => {
    afterEach(() => {
        http.then((server) => {
            server.close();
        });
    });

    it('Регистрация пользователя (/user/create)', () => {
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
            res => { expect(res.body.success).toEqual(true); }
        );
    });

    it('Регистрация пользователя (/user/create) - ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'incorrect_email' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Регистрация пользователя (/user/create) - ошибка в getUserByEmail', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'find@error.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Регистрация пользователя (/user/create) - ошибка в create', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'insertone@error.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });

    it('Регистрация пользователя (/user/create) - ошибка в sendMail', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'sendmail@error.ru' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Internal server error']); }
        );
    });
});
