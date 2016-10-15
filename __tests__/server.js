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
                    .send({ email: 'simple@user.ru' })
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

    it('Если пользователь авторизован', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'simple@user.ru' })
                    .set('Cookie', 'mongo.find.user')
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
            res => { expect(res.body.success).toEqual(false); }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'simple@user.ru' })
                    .set('Cookie', 'mongo.find.error')
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

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'invalid.email' })
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
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'mongo.find.error@email.ru' })
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
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'mongo.insertone.error@email.ru' })
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
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'nedb.insert.error@email.ru' })
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
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'nodemailer.sendmail.error@email.ru' })
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

describe('Сброс пароля (/user/forgot) - ', () => {
    it('Успешный сброс', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'simple@user.ru' })
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

    it('Если пользователь авторизован', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'simple@user.ru' })
                    .set('Cookie', 'mongo.find.user')
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
            res => { expect(res.body.success).toEqual(false); }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'simple@user.ru' })
                    .set('Cookie', 'mongo.find.error')
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

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'invalid.email' })
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

    it('Ошибка в setPasswordByEmail (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'mongo.updateone.error@email.ru' })
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

    it('Ошибка в setPasswordByEmail (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'nedb.update.error@email.ru' })
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

    it('Отсутствие затронутых записей в БД', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'mongo.updateone.nomodified@email.ru' })
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
            res => { expect(res.body.success).toEqual(false); }
        );
    });

    it('Ошибка в sendMail', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'nodemailer.sendmail.error@email.ru' })
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

describe('Авторизация пользователя (/user/signin) - ', () => {
    it('Успешная авторизация', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
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

    it('Если пользователь авторизован', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .set('Cookie', 'mongo.find.user')
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

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
                    .set('Cookie', 'mongo.find.error')
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

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'user.signin.incorrect.email.test',
                        password: 'pMBXHsgErq1V',
                    })
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

    it('Ошибка в getUserByEmail (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.error@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
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

    it('Ошибка в setSessionById (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user.mongo.updateone.error@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
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

    it('Ошибка в setSessionById (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/signin')
                    .send({
                        email: 'mongo.find.user.nedb.update.error@email.ru',
                        password: 'pMBXHsgErq1V',
                    })
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

describe('Выход из сессии (/user/signout) - ', () => {
    it('Успешный выход из сессии', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'mongo.find.user')
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

    it('Если пользователь не авторизован', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
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

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'mongo.find.error')
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

    it('Ошибка в unsetSessionById (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'mongo.find.user.mongo.updateone.error')
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

    it('Ошибка в unsetSessionById (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/user/signout')
                    .set('Cookie', 'mongo.find.user.nedb.update.error')
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

describe('Запрос данных профиля (/api/profile) - ', () => {
    it('Успешное получение данных', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/profile')
                    .set('Cookie', 'mongo.find.user')
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
            res => {
                expect(res.body.success).toEqual(true);
                expect(res.body.profile.email).toEqual('simple@user.ru');
            }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/profile')
                    .set('Cookie', 'mongo.find.error')
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

    it('Не авторизированный пользователь', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/profile')
                    .expect(403)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Forbidden resource']); }
        );
    });
});

describe('Обновление данных профиля (/api/profile) - ', () => {
    it('Успешное получение данных', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'simple@user.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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
            res => {
                expect(res.body.success).toEqual(true);
            }
        );
    });

    it('Дублирование email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'mongo.find.user@email.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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
            res => {
                expect(res.body.success).toEqual(false);
                expect(res.body.exist).toEqual(true);
            }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'simple@user.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.error')
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

    it('Не авторизированный пользователь', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'simple@user.ru',
                        address: '127.0.0.1',
                    })
                    .expect(403)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Forbidden resource']); }
        );
    });

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'invalid.email',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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

    it('Ошибка валидации IP', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'simple@user.ru',
                        address: 'invalid.ip',
                    })
                    .set('Cookie', 'mongo.find.user')
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
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'mongo.find.error@email.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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

    it('Ошибка в update (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'mongo.updateone.error@email.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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

    it('Ошибка в update (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .put('/api/profile')
                    .send({
                        email: 'nedb.update.error@email.ru',
                        address: '127.0.0.1',
                    })
                    .set('Cookie', 'mongo.find.user')
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

describe('Смена пароля (/api/password) - ', () => {
    it('Успешная смена пароля', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: 'simple.password',
                    })
                    .set('Cookie', 'mongo.find.user')
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
            res => {
                expect(res.body.success).toEqual(true);
            }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: 'simple.password',
                    })
                    .set('Cookie', 'mongo.find.error')
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

    it('Не авторизированный пользователь', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: 'simple.password',
                    })
                    .expect(403)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Forbidden resource']); }
        );
    });

    it('Ошибка валидации пароля', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: '',
                    })
                    .set('Cookie', 'mongo.find.user')
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

    it('Ошибка в update (mongo)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: 'simple.password',
                    })
                    .set('Cookie', 'mongo.find.user.mongo.updateone.error')
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

    it('Ошибка в update (nedb)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/api/password')
                    .send({
                        password: 'simple.password',
                    })
                    .set('Cookie', 'mongo.find.user.nedb.update.error')
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

describe('Запрос списка уведомлений об платежах (/api/payment) - ', () => {
    it('Успешное получение списка', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/payment')
                    .set('Cookie', 'mongo.find.user')
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
            res => {
                expect(res.body.success).toEqual(true);
                expect(res.body.payments).toEqual([]);
                expect(res.body.total).toEqual(0);
            }
        );
    });

    it('Ошибка в getUserBySession', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/payment')
                    .set('Cookie', 'mongo.find.error')
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

    it('Не авторизированный пользователь', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/payment')
                    .expect(403)
                    .end((err, res) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(res);
                    });
            });
        }).then(
            res => { expect(res.body.errors).toEqual(['Forbidden resource']); }
        );
    });

    it('Ошибка в listById(find)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/payment')
                    .set('Cookie', 'mongo.find.user.mongo.find.error')
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

    it('Ошибка в listById(count)', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .get('/api/payment')
                    .set('Cookie', 'mongo.find.user.mongo.count.error')
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

describe('Уведомление о платеже Яндекс.Деньги (/ym_notification) - ', () => {
    const
        simplePayment = {
            notification_type: 'card-incoming',
            zip: '',
            amount: '980.00',
            firstname: '',
            codepro: 'false',
            withdraw_amount: '1000.00',
            city: '',
            unaccepted: 'false',
            label: '57bb6e49c6051f12e896d424',
            building: '',
            lastname: '',
            datetime: '2016-09-05T09:51:06Z',
            suite: '',
            sender: '',
            phone: '',
            sha1_hash: '891cdecd248ce5dc4914adf9f6efd2f354ebdb2f',
            street: '',
            flat: '',
            fathersname: '',
            operation_label: '1f5f538f-0002-5000-8034-557be6293496',
            operation_id: '526384266906100012',
            currency: '643',
            email: 'simple@user.ru',
        };

    afterEach(() => {
        http.then(server => {
            server.close();
        });
    });

    it('Успешное уведомление о платеже', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/ym_notification')
                    .send(simplePayment)
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
            res => {
                expect(res.body).toEqual({});
            }
        );
    });
});
