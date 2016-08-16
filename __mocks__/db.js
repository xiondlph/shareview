const
    db = {
        collection(name, callback) {
            callback(null, {
                findOne(query, callback) {
                    callback(null, {
                        _id: '57acf3a493f8f719f4aa6423',
                        email: 'test@ismax.ru',
                        active: false,
                        address: '12.0.0.1',
                        period: 1471038756540,
                        password: '702cf16df53b1b8d670aad4265fdaf0d66ff18c1dcac680d2079a3bd89b577a2',
                        salt: '9be79a1476b8d6bf4e50d705ff34b4c8b775c61c0deb2d37805f5ecb9fd96551',
                        sid: 'AWop0J4p2RdtTiabvckyRCF9XSj34-xa',
                    });
                },
            });
        },
    },
    init = new Promise((resolve) => {
        resolve();
    });

export default db;

export { init };
