module.exports = {
    index: {
        options: {
            banner: '/* Index minified */'
        },
        files: {
            'hosts/base/static/build/index.css': ['hosts/base/static/css/common.css', 'hosts/base/static/css/index.css']
        }
    }
};