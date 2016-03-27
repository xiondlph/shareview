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
    'View/Menu',
    'View/Signup',
    'View/Loader'
], function ($, IScroll, Menu, Signup, Loader) {

    $(function () {
        var signup  = new Signup({obj: $('.b-section')}),
            menu    = new Menu({el: $('.b-menu')}),
            loader  = new Loader({obj: $('body')}),
            iScroll = new IScroll('.b-nav', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true,
                click: true
            }),
            user    = $('.b-header').attr('auth');

        menu.render(iScroll);
        loader.render();

        if (!user) {
            signup.render();
        }

        Backbone.history.start();
    });
});