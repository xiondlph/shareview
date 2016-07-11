/**
 * Review контроллер
 *
 * @module      Hosts.Base.Controller.Review
 * @class       Controller.Review
 * @namespace   Hosts.Base
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */



// Объявление модулей
var querystring = require("querystring");


 /**
 * Получение данных профиля
 *
 * @method get
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.get = function (req, res) {
    var result,
        reviews,
        page = 1;

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (!req.query.hasOwnProperty('text') || !req.query.text) {
        res.send([]);
        return;
    }

    if (req.query.hasOwnProperty('page')) {
        page = req.query.page;
        delete req.query.page;
    }

    req.query.count = 1;
    req.api('/v1/search.json?' + querystring.stringify(req.query), function (err, status, data) {
        if (err || status !== 200) {
            res.send([]);
            return;
        }

        result = JSON.parse(data);

        if (result.searchResult.results.length > 0 && result.searchResult.results[0].hasOwnProperty('model')) {
            req.api('/v1/model/' + result.searchResult.results[0].model.id + '/opinion.json?page=' + page, function (err, status, data) {
                if (err || status !== 200) {
                    res.send([]);
                    return;
                }

                reviews = JSON.parse(data);

                res.send(reviews);
            });
        } else {
            res.send([]);
        }
    });
};
