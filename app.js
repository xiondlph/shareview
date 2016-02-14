/**
 * Главный модуль приложения - точка входа
 *
 * @module      Main
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
var cluster         = require('cluster'),
    mongo           = require('./db');

// Главный процесс
if (cluster.isMaster) {
    console.log('%s - Start master', (new Date()).toUTCString());

    cluster.fork();

    // В случае падения процесса, запуск нового (арг. функ - worker)
    cluster.on('disconnect', function (worker) {
        console.error('%s - Worker disconnect!', (new Date()).toUTCString());

        if (worker.id < 2) { // Лимитирование запускаемых форкеров
            cluster.fork();
        }
    });

// Дочерний процесс
} else {
    var server;

    console.log('%s - Start worker', (new Date()).toUTCString());
    console.log('Worker %s pid %s', cluster.worker && cluster.worker.id, process.pid);

    // Модуль web-сервера
    server = require('./server');


    // mongo.db.on('authenticated', function () {
        // Запуск сервера
        server.start();
    // });

    // Инициализация БД
    // mongo.init();
}