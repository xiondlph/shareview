/**
 * Модуль перехвата и обработки исключений
 *
 * @module      Exception
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


 // Объявление модулей
var debug         = require('debug')('express:shareview:exception'),
    cluster       = require('cluster'),
    fs            = require('fs');


// Установка количества элементов в стеке исключений = 5
Error.stackTraceLimit = 10;


// Перехват формирования стека ошибок
Error.prepareStackTrace = function (err, stack) {
    var log = {
        message: err.message,
        stack: []
    };

    stack.forEach(function (frame) {
        log.stack.push({
            time:     (new Date()).toUTCString(),
            file:     frame.getFileName(),
            line:     frame.getLineNumber(),
            column:   frame.getColumnNumber(),
            func:     frame.getFunctionName()
        });
    });

    //return JSON.stringify(log, null, "\t");
    return log;
};


// Перехват брошенного исключения
process.on('uncaughtException', function (err) {
    err.stack.message = 'uncaughtException: ' + err.stack.message;

    // Запись стека ошибки в лог файл
    fs.open(__dirname + '/log/error.log', 'a', function (e, id) {
        fs.write(id, JSON.stringify(err.stack, null, "\t") + "\n", null, 'utf8', function () {
            fs.close(id, function () {
                // Завершение текущего процесса
                cluster.worker.disconnect();
                process.exit(1);
            });
        });
    });

    // Вывод стека ошибок в stderr
    debug(err.stack);
});