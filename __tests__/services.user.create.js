import supertest from 'supertest';
import http from '../server';

jest.mock('../db');

describe('Регистрация пользователя (/user/create) - ', () => {
    afterEach(() => {
        http.then((server) => {
            server.close();
        });
    });

    it('Успешная регистрация', () => {
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

    it('Ошибка валидации email', () => {
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

    it('Ошибка в getUserByEmail', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'find@mongo.error' })
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

    it('Ошибка в create (mongo)', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'insertone@mongo.error' })
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

    it('Ошибка в create (nedb)', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'insert@nedb.error' })
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

    it('Ошибка в sendMail', () => {
        return new Promise((resolve, reject) => {
            http.then((server) => {
                supertest.agent(server)
                    .post('/user/create')
                    .send({ email: 'sendmail@nodemailer.error' })
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
