/**
 * Request утилита
 *
 * @module      Util.Request
 * @main        Shareview review service
 * @author      Ismax <admin@ismax.ru>
 */

// Объявление модулей
import http from 'http';

const
    /**
     * Запрос к API в ICSYSTEM
     *
     * @method api
     * @param {Object} req Объект запроса сервера
     * @param {Object} res Объект ответа сервера
     * @param {Function} next
     */
    api = (req, res, next) => {
        // Добавление параметра remote_ip, если нет geo_id
        if (!req.query.geo_id) {
            req.query.remote_ip = req.headers['x-forwarded-for'];
        }

        /**
         * Выполенение GET запроса к API
         *
         * @method api
         * @param {String} url
         * @param {Function} accept
         */
        req.api = (url, accept) => {
            var request;

            request = http.request({
                host: '127.0.0.1',
                port: 3000,
                path: url,
                method: 'GET',
                headers: {
                    Host: 'market.icsystem.ru',
                    'X-Ismax-Key': '08e212273409793c3199f9cf1a02e2261f78dfd5bb4e5c8776a48299cab0041f',
                    'X-Forwarded-Proto': 'http',
                    'X-Forwarded-for': req.headers['x-forwarded-for'],
                },
            }, (response) => {
                var data = '';

                response.on('data', (chunk) => {
                    data += chunk.toString();
                });

                response.on('end', () => {
                    accept(null, response.statusCode, data);
                });
            });

            request.on('error', (err) => {
                accept(err);
            });

            request.end();
        };

        next();
    };

export default {
    api,
};
