/**
 * Модуль представления меню
 *
 * @module      View.User
 * @category    Client side
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


define([
    'backbone'
], function (Backbone) {


    /**
     * Представление меню
     *
     * @class       Menu
     * @namespace   View
     * @constructor
     * @extends     Backbone.View
     */
    var Menu = Backbone.View.extend({

        // initialize: function () {
        //     document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        // },

        render: function (iScroll) {
            var current = $('.b-nav__list__item__link[href="' + document.location.pathname + '"]');
            if (current.length) {
                current.parent().addClass('b-nav__list__item_active');
                iScroll.scrollToElement(current.parent().get(0));
            }

            return this.$el;
        }
    });

    return Menu;
});