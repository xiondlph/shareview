/**
 * Мок для express-session плагина
 */

function session() {
    return function session(req, res, next) {
        req.session = {
            id: req.headers.cookie,
        };
        next();
    };
}

exports = module.exports = session;
