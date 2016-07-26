/**
 * Главный модуль приложения - точка входа
 *
 * @module      Main
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import cluster from 'cluster';
import debug from 'debug';
import {init as db} from './db';
import server from './server';

const
    logApp = debug('shareview:app');

// Главный процесс
if (cluster.isMaster) {
    logApp('%s - Start master', (new Date()).toUTCString());

    cluster.fork();

    // В случае падения процесса, запуск нового (арг. функ - worker)
    cluster.on('disconnect', (worker) => {
        logApp('%s - Worker disconnect!', (new Date()).toUTCString());

        if (worker.id < 2) { // Лимитирование запускаемых форкеров
            cluster.fork();
        }
    });

// Дочерний процесс
} else {
    logApp('%s - Start worker', (new Date()).toUTCString());
    logApp('Worker %s pid %s', cluster.worker && cluster.worker.id, process.pid);

    db().then(server);
}