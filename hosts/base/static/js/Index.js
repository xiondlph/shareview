/**
 * Модуль инициализации главной стр.
 *
 * @module      Index
 * @category    Client side
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */

require.config({
    baseUrl: 'js',
    paths: {
        text        : '../lib/requirejs/text',
        jquery      : '../lib/jquery/jquery-2.1.1.min',
        validator   : '../lib/validator.min',
        underscore  : '../lib/underscore/underscore-min',
        backbone    : '../lib/backbone/backbone-min'
    },

    shim: {
        'backbone': {
            deps    : ['underscore', 'jquery'],
            exports : 'Backbone'
        }
    }
});

require([
    'jquery'
], function ($) {

    $(function () {
        console.log('Start');
    });
});