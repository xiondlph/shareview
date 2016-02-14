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
                backbone    : '../lib/backbone/backbone-min'
            },

            shim: {
                'backbone': {
                    deps    : ['underscore', 'jquery'],
                    exports : 'Backbone'
                }
            },
            preserveLicenseComments: false,
            optimize: 'uglify2',
            name: "Index",
            out: "hosts/base/static/build/index.js",
            include: ["requireLib"]
        }
    }
};