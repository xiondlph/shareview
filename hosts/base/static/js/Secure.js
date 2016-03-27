/**
 * Модуль инициализации стр. системы безопастности
 *
 * @module      Secure
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
    'View/Secure',
    'View/Loader'
], function ($, IScroll, Menu, Secure, Loader) {

    // Маршруты
    function signin() {
        var Signin = new Secure.Signin({obj: $('.b-section')});
        Signin.render();
    }

    function forgot() {
        var Forgot = new Secure.Forgot({obj: $('.b-section')});
        Forgot.render();
    }

    $(function () {
        var router  = new Backbone.Router(),
            menu    = new Menu({el: $('.b-menu')}),
            loader  = new Loader({obj: $('body')}),
            iScroll;

        loader.render();

        setTimeout(function () {
            iScroll = new IScroll('.b-nav', {
                scrollX: true,
                scrollY: false,
                mouseWheel: true,
                click: true
            });
            menu.render(iScroll);
        });

        // Маршрутизация
        router.route('*other', 'default', signin);
        router.route('login', 'signin', signin);
        router.route('forgot', 'forgot', forgot);

        Backbone.history.start();
    });
});