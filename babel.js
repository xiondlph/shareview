const
    fs = require('fs'),
    babelrc = fs.readFileSync('./.babelrc');

var config;

try {
    config = JSON.parse(babelrc);
} catch (err) {
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error('Error parsing .babelrc.');
    console.error(err);
}

config = Object.assign({}, config, {
    retainLines: true,
});

require('babel-register')(config);
