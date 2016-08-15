// jest.unmock('supertest');
// jest.unmock('express');
// var request = require('supertest'),
//     express = require('express'),
//     app = express(),
//     agent = request.agent(app);
//
// describe('Запросы к API - ', () => {
//     it('Запрос к /', () => {
//         return new Promise((resolve, reject) => {
//             agent
//                 .post('/')
//                 .expect(404)
//                 .expect('set-cookie', /^shareview.sid=(.*)/)
//                 .end((err, res) => {
//                     if (err) {
//                         reject(err);
//                         return;
//                     }
//                     resolve(res);
//                 });
//         }).then(
//             null,
//             err => { expect(err).toEqual(null); }
//         );
//     });
// });

jest.unmock('supertest');
jest.unmock('express');

jest.mock('querystring');
jest.unmock('../test');
var request = require('supertest'),
    express = require('express'),
    test = require('../test'),
    app = express(),
    server;

beforeEach(function () {
    app.get('/', test);
    server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Example app listening at port %s', port);
    });
});
afterEach(function () {
    server.close();
});

describe('Запросы к API - ', () => {
    it('Запрос к /', () => {
        expect(test({ name: 'debug' })).toEqual('name=test');

        // return new Promise((resolve, reject) => {
        //     request(server)
        //         .get('/')
        //         .expect(200)
        //         .end((err, res) => {
        //             if (err) {
        //                 reject(err);
        //                 return;
        //             }
        //             resolve(res);
        //         });
        // }).then(
        //     null,
        //     err => { expect(err).toEqual(null); }
        // );
    });
});
