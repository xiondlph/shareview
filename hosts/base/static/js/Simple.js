/**
 * Модуль инициализации текстовой стр.
 *
 * @module      Simple
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
        backbone    : '../lib/backbone/backbone-min',
        iscroll     : '../lib/iscroll',

        Templates   : '../Templates'
    },

    shim: {
        'backbone': {
            deps    : ['underscore', 'jquery'],
            exports : 'Backbone'
        },
        'iscroll':  {
            exports: 'IScroll'
        }
    }
});

require([
    'jquery',
    'iscroll',
    'View/Menu'
], function ($, IScroll, Menu) {
    var menu    = new Menu({el: $('.b-menu')}),
        iScroll = new IScroll('.b-nav', {
            scrollX: true,
            scrollY: false,
            mouseWheel: true,
            click: true
        });

    menu.render(iScroll);
});