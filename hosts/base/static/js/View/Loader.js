/**
 * Модуль представления индикатора загрузки
 *
 * @module      View.Loader
 * @category    Client side
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


define([
    'backbone'
], function (Backbone) {


    /**
     * Представление индикатора загрузки
     *
     * @class       Loader
     * @namespace   View
     * @constructor
     * @extends     Backbone.View
     */
    var Loader = Backbone.View.extend({
        className: 'b-loader',

        initialize: function () {
            var me = this,
                _orgAjax = $.ajaxSettings.xhr;

            $.ajaxSettings.xhr = function () {
                var xhr = _orgAjax();
                xhr.onprogress = function (e) {
                    console.log(e.loaded);
                };

                xhr.upload.onprogress = function (e) {
                    console.log(e.loaded);
                };

                xhr.onreadystatechange = function () {

                    me.$el.find('.b-loader__line').stop().animate({
                        width: (xhr.readyState * 100) + '%'
                    }, 100);
                };

                return xhr;
            };


            $(document).ajaxStart(function () {
                me.$el.find('.b-loader__line').css('width', '0%');
                me.$el.fadeIn();
            });

            $(document).ajaxStop(function () {
                setTimeout(function () {
                    me.$el.fadeOut();
                }, 100);
            });

            $(document).ajaxError(function (event, request, settings) {
                setTimeout(function () {
                    me.$el.fadeOut();
                    if (request.status === 401) {
                        me.unauthorized();
                    }
                }, 100);
            });
        },

        render: function () {
            this.$el.append('<div class="b-loader__line"></div>');
            this.options.obj.append(this.$el);

            return this.$el;
        }
    });


    return Loader;
});