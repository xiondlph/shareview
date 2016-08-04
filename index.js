/**
 * Главный модуль приложения - точка входа
 *
 * @module      Index
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
const
    log = require('debug')('shareview:index'),
    env = require('./env');

// Интеграция переменных окружения
process.env = Object.assign(env, process.env);

require('./babel');

// Модуль web-сервера
require('./server');
