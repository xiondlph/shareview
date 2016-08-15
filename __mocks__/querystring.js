const querystring = jest.genMockFromModule('querystring');

querystring.stringify = function (query) {
    return 'name=test';
};
module.exports = querystring;
