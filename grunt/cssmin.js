module.exports = {
    index: {
        options: {
            banner: '/* Index minified */'
        },
        files: {
            'hosts/base/static/build/index.css': ['hosts/base/static/css/common.css', 'hosts/base/static/css/index.css']
        }
    },

    secure: {
        options: {
            banner: '/* Secure minified */'
        },
        files: {
            'hosts/base/static/build/secure.css': ['hosts/base/static/css/common.css']
        }
    },

    simple: {
        options: {
            banner: '/* Simple minified */'
        },
        files: {
            'hosts/base/static/build/simple.css': ['hosts/base/static/css/common.css', 'hosts/base/static/css/simple.css']
        }
    }
};