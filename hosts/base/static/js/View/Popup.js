/**
 * Модуль представления всплывающего окна
 *
 * @module      View.Popup
 * @category    Client side
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


define([
    'backbone'
], function (Backbone) {


    /**
     * Представление всплывающего окна
     *
     * @class       Popup
     * @namespace   View
     * @constructor
     * @extends     Backbone.View
     */
    var Popup = Backbone.View.extend({
        className:      'b-popup',
        events: {
            'click':    'click',
            'close':    'close'
        },

        render: function () {
            var me = this;
            me.$el.append('<div class="b-popup__inner"></div>');
            me.$el.find('.b-popup__inner').html(me.options.content);
            $('body').prepend(me.$el);
            me.$el.find('.b-popup__inner').css({
                width: me.options.content.outerWidth(),
                marginTop: '-' + (me.options.content.outerHeight()) + 'px'
            });


            $('body').addClass('m-no-scroll');
            me.$el.find('.b-popup__inner').addClass('b-popup__inner_animate');

            me.$el.css({
                'opacity': '1'
            });

            me.$el.find('.b-popup__inner').css({
                'opacity': '1'
            });

            return me.$el;
        },

        click: function (e) {
            if ($(e.target).is('.b-popup')) {
                this.close();
            }
        },

        close: function () {
            var me = this;

            $('body').removeClass('m-no-scroll');
            me.$el.find('.b-popup__inner').removeClass('b-popup__inner_animate');

            setTimeout(function () {
                me.$el.css({
                    'opacity': '0'
                });

                me.$el.find('.b-popup__inner').css({
                    'opacity':      '0'
                });

                me.remove();
            }, 200);
        }
    });

    return Popup;
});