/**
 * Index контроллер
 *
 * @module      Hosts.Base.Controller.Index
 * @class       Controller.Index
 * @namespace   Hosts.Base
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


/**
 * Домашняя страница
 *
 * @method index
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 * @param {Function} next
 */
exports.index = function (req, res) {
    res.render('index');
};


/**
 * Страница Sitemap.xml
 *
 * @method sitemap
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 * @param {Function} next
 */
exports.sitemap = function (req, res) {
    res.type('application/xml');
    res.render('sitemap');
};


/**
 * Страница 404 ошибки
 *
 * @method notfound
 * @param {Object} req Объект запроса сервера
 * @param {Object} res Объект ответа сервера
 */
exports.notfound = function (req, res) {
    res.status(404);
    res.render('404');
};