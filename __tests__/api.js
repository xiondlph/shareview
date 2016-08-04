jest.unmock('supertest');
var request = require('supertest');

describe('API request', () => {
    it('to /', () => {
        request('http://localhost:3001/')
            .get('/ggg')
            .expect(404)
            .end((err, res) => {
                console.log(err)
                expect(err).toEqual(null);
            });
    });
});
