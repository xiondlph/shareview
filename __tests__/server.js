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
                    .send({ email: 'user.create@succes.test' })
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
            request.then(agent => {
                agent
                    .post('/user/create')
                    .send({ email: 'user.create.incorrect.email.test' })
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
                    .send({ email: 'user.create@mongo.find.error.test' })
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
                    .send({ email: 'user.create@mongo.insertone.error.test' })
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
                    .send({ email: 'user.create@nedb.insert.error.test' })
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
                    .send({ email: 'user.create@nodemailer.sendmail.error.test' })
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
                    .send({
                        email: 'user.forgot@success.test',
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

    it('Ошибка валидации email', () => {
        return new Promise((resolve, reject) => {
            request.then(agent => {
                agent
                    .post('/user/forgot')
                    .send({ email: 'user.forgot.incorrect.email.test' })
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
                    .send({ email: 'user.forgot@mongo.updateone.error.test' })
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
                    .send({ email: 'user.forgot@nedb.update.error.test' })
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
                    .send({ email: 'user.forgot@mongo.updateone.nomodified.test' })
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
                    .send({ email: 'user.forgot@nodemailer.sendmail.error.test' })
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

// describe('Авторизация пользователя (/user/signin) - ', () => {
//     it('Ошибка валидации email', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .post('/user/signin')
//                     .send({
//                         email: 'user.signin.incorrect.email.test',
//                         password: 'pMBXHsgErq1V',
//                     })
//                     .expect(500)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => { expect(res.body.errors).toEqual(['Internal server error']); }
//         );
//     });
//
//     it('Ошибка в setSessionById (mongo)', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .post('/user/signin')
//                     .send({
//                         email: 'user.signin@mongo.updateone.error.test',
//                         password: 'pMBXHsgErq1V',
//                     })
//                     .expect(500)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => { expect(res.body.errors).toEqual(['Internal server error']); }
//         );
//     });
//
//     it('Ошибка в setSessionById (nedb)', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .post('/user/signin')
//                     .send({
//                         email: 'user.signin@nedb.update.error.test',
//                         password: 'pMBXHsgErq1V',
//                     })
//                     .expect(500)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => { expect(res.body.errors).toEqual(['Internal server error']); }
//         );
//     });
//
//     it('Успешная авторизация', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .post('/user/signin')
//                     .send({
//                         email: 'user.signin@success.test',
//                         password: 'pMBXHsgErq1V',
//                     })
//                     .expect(200)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => { expect(res.body.success).toEqual(true); }
//         );
//     });
// });
//
// describe('Выход из сессии (/user/signout) - ', () => {
//     it('Успешный выход из сессии', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .get('/user/signout')
//                     .expect(200)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => { expect(res.body.success).toEqual(true); }
//         );
//     });
// });
//
// describe('Запрос данных профиля (/api/profile) - ', () => {
//     afterEach(() => {
//         http.then(server => {
//             server.close();
//         });
//     });
//
//     it('Успешное получение данных', () => {
//         return new Promise((resolve, reject) => {
//             request.then(agent => {
//                 agent
//                     .get('/api/profile')
//                     .expect(200)
//                     .end((err, res) => {
//                         if (err) {
//                             reject(err);
//                             return;
//                         }
//                         resolve(res);
//                     });
//             });
//         }).then(
//             res => {
//                 expect(res.body.success).toEqual(true);
//                 expect(res.body.profile.email).toEqual('shukhrat@ismax.ru');
//             }
//         );
//     });
// });
