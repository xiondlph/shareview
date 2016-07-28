/**
 * Модуль запуска через кластеры - точка входа
 *
 * @module      Сluster
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
var cluster = require('cluster'),
    log     = require('debug')('shareview:cluster'),
    env     = require('./env');

// Интеграция переменных окружения
process.env = Object.assign(env, process.env);

// Главный процесс
if (cluster.isMaster) {
    log('%s - Start master', (new Date()).toUTCString());

    cluster.fork();

    // В случае падения процесса, запуск нового (арг. функ - worker)
    cluster.on('disconnect', (worker) => {
        log('%s - Worker disconnect!', (new Date()).toUTCString());

        if (worker.id < 2) { // Лимитирование запускаемых форкеров
            cluster.fork();
        }
    });

// Дочерний процесс
} else {
    log('%s - Start worker', (new Date()).toUTCString());
    log('Worker %s pid %s', cluster.worker && cluster.worker.id, process.pid);

    require('./babel');

    // Модуль web-сервера
    require('./server');
}