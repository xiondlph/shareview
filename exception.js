/**
 * Модуль перехвата и обработки исключений
 *
 * @module      Exception
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

// Объявление модулей
import cluster from 'cluster';
import debug from 'debug';
import fs from 'fs';

// Установка количества элементов в стеке исключений = 5
Error.stackTraceLimit = 5;

const
    log = debug('express:shareview:exception');

// Перехват формирования стека ошибок
Error.prepareStackTrace = (err, stack) => {
    var errLog = {
        message: err.message,
        stack: [],
    };

    stack.forEach((frame) => {
        errLog.stack.push({
            time: (new Date()).toUTCString(),
            file: frame.getFileName(),
            line: frame.getLineNumber(),
            column: frame.getColumnNumber(),
            func: frame.getFunctionName(),
        });
    });

    // return JSON.stringify(errLog, null, "\t");
    return errLog;
};

// Перехват брошенного исключения
process.on('uncaughtException', (err) => {
    err.stack.message = `uncaughtException: ${err.stack.message}`;

    // Проверка доступности директории для логов
    fs.access(`${process.env.APPPATH}/log/`, fs.constants.R_OK | fs.constants.W_OK, (fErr) => {
        if (!fErr) {
            // Запись стека ошибки в лог файл
            const fd = fs.openSync(`${process.env.APPPATH}/log/error.log`, 'a');

            fs.writeSync(fd, `${JSON.stringify(err.stack, null, '\t')}\n`, null, 'utf8');
            fs.closeSync(fd);

            // Завершение текущего процесса
            cluster.worker.disconnect();
            process.exit(1);
        }
    });

    // Вывод стека ошибок в stdout
    log(err.stack);
});
