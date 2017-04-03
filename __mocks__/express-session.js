/**
 * Мок для express-session плагина
 */

/* eslint no-shadow: ["error", { "allow": ["session"] }] */
function session() {
    return function session(req, res, next) {
        req.session = {
            id: req.headers.cookie,
        };
        next();
    };
}

exports = module.exports = session;
