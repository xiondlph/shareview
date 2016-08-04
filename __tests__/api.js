jest.unmock('supertest');
var request = require('supertest');

describe('API request', () => {
    it('to method: /', () => {
        return new Promise((resolve, reject) => {
            request('http://localhost:3001/')
                .get('/ggg')
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
        }).then(
            res => {
                expect(res.body.errors).toBeDefined();
            },
            err => { expect(err).toBeNull(); }
        );
    });
});
