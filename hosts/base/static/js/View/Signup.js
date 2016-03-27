/**
 * Модуль представления формы регистрации
 *
 * @module      View.Signup
 * @category    Client side
 * @main        Shareview review service
 * @author      Ismax <shukhrat@ismax.ru>
 */


define([
    'backbone',
    'validator',
    'View/Popup',
    'text!Templates/Signup.tpl',
    'text!Templates/Popup/Success.tpl',
    'text!Templates/Popup/Error.tpl'
], function (Backbone, Validator, Popup, _signup, _success, _error) {


    /**
     * Представление формы регистрации
     *
     * @class       Signup
     * @namespace   View
     * @constructor
     * @extends     Backbone.View
     */
    var Signup = Backbone.View.extend({
        tagName:    'form',
        className:  'b-form',

        events: {
            'input .j-form__field__input' :     'input',
            'submit' :                          'submit'
        },

        render: function () {
            this.$el.append(_.template(_signup));

            this.options.obj.append(this.$el);
            return this.$el;
        },

        input: function (e) {
            if ($(e.currentTarget).val().length > 0) {
                $(e.currentTarget).addClass('b-form__field__input_fill');
                $(e.currentTarget).removeClass('b-form__field__input_invalid');
            } else {
                $(e.currentTarget).removeClass('b-form__field__input_fill');
            }
        },

        submit: function (e) {
            var me      = this,
                valid   = true,
                popup;

            e.preventDefault();

            if (!Validator.isLength(this.$el.find('input[name="email"]').val(), 1, 255)) {
                this.$el.find('input[name="email"]').addClass('b-form__field__input_invalid');
                this.$el.find('input[name="email"]').next('.b-form__field__label').find('.b-form__field__label__invalid').text('Необходимо ввести Email');
                valid = false;
            } else {
                if (!Validator.isEmail(this.$el.find('input[name="email"]').val())) {
                    this.$el.find('input[name="email"]').addClass('b-form__field__input_invalid');
                    this.$el.find('input[name="email"]').next('.b-form__field__label').find('.b-form__field__label__invalid').text('Неверный формат Email');
                    valid = false;
                } else {
                    this.$el.find('input[name="email"]').removeClass('b-form__field__input_invalid');
                    this.$el.find('input[name="email"]').next('.b-form__field__label').find('.b-form__field__label__invalid').text('');
                }
            }


            if (valid) {
                $.ajax({
                    url         : 'https://' + document.location.host + '/user/create',
                    type        : 'POST',
                    data: {
                        email:  me.$el.find('input[name="email"]').val(),
                        ref:    $('.b-header').attr('ref')
                    }
                }).done(function (data) {
                    if (data.exist && data.exist === true) {
                        me.$el.find('input[name="email"]').addClass('b-form__field__input_invalid');
                        me.$el.find('input[name="email"]').next('.b-form__field__label').find('.b-form__field__label__invalid').text('Пользователь с таким Email адресом уже существует');
                    } else {
                        popup = new Popup({content: $(_.template(_success)({message: '<h2>Вы зарегистрированы</h2>На Ваш Email было выслано сообщение с информации о доступе и спользовании сервиса.'}))});
                        popup.render();
                    }
                }).fail(function (data) {
                    popup = new Popup({content: $(_error)});
                    popup.render();
                });
            }

            return false;
        }
    });

    return Signup;
});