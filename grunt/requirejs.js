module.exports = {
    index: {
        options: {
            baseUrl: "hosts/base/static/js",
            paths: {
                requireLib  : '../lib/requirejs/require',
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
            },
            preserveLicenseComments: false,
            optimize: 'uglify2',
            name: "Index",
            out: "hosts/base/static/build/index.js",
            include: ["requireLib"]
        }
    },

    secure: {
        options: {
            baseUrl: "hosts/base/static/js",
            paths: {
                requireLib  : '../lib/requirejs/require',
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
            },
            preserveLicenseComments: false,
            optimize: 'uglify2',
            name: "Secure",
            out: "hosts/base/static/build/secure.js",
            include: ["requireLib"]
        }
    },

    simple: {
        options: {
            baseUrl: "hosts/base/static/js",
            paths: {
                requireLib  : '../lib/requirejs/require',
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
            },
            preserveLicenseComments: false,
            optimize: 'uglify2',
            name: "Simple",
            out: "hosts/base/static/build/simple.js",
            include: ["requireLib"]
        }
    }
};