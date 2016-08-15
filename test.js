import querystring from 'querystring';

const
    test = (query) => {
        return querystring.stringify(query);
    };

module.exports = test;
