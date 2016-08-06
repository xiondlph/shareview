jest.unmock('supertest');

var request = require('supertest'),
    agent = request.agent('http://localhost:3001');

describe('Запросы к API - ', () => {
    it('Авторизация: /user/signin', () => {
        return new Promise((resolve, reject) => {
            agent
                .post('/user/signin')
                .send({ email: 'shukhrat@ismax.ru', password: '123' })
                .expect(200)
                .expect('set-cookie', /^shareview.sid=(.*)/)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
        }).then(
            null,
            err => { expect(err).toEqual(null); }
        );
    });

    it('Данные профиля: /api/profile', () => {
        return new Promise((resolve, reject) => {
            agent
                .get('/api/profile')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
        }).then(
            res => {
                expect(res.body.success).toBeDefined();
                expect(res.body.success).toBeTruthy();

                expect(res.body.profile).toBeDefined();
                expect(res.body.profile.email).toContain('shukhrat@ismax.ru');
            },
            err => { expect(err).toEqual(null); }
        );
    });
});
