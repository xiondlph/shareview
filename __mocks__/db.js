/**
 * Мок для db модуля
 */

const
    user = {
        _id: '57bb6e49c6051f12e896d424',
        email: 'shukhrat@ismax.ru',
        active: false,
        address: '127.0.01',
        period: 1471987657311,
        password: 'fa8c83c3672c617cb56422f9609b2cd579b5d443e0c07b66754edf297f574f25',
        salt: '9be79a1476b8d6bf4e50d705ff34b4c8b775c61c0deb2d37805f5ecb9fd96551',
        sid: '3fy7m_5CdLUAaboAcdcTMAAblz2OZr4Y',
    },
    find = query => {
        return {
            limit() {
                return {
                    toArray() {
                        if (query.email && query.email === 'find@mongo.error') {
                            return Promise.reject(Error('Mongo error (find)'));
                        }

                        if (query.email && query.email === 'shukhrat@ismax.ru') {
                            return Promise.resolve([user]);
                        }

                        return Promise.resolve([]);
                    },
                };
            },
        };
    },
    insertOne = data => {
        if (data.email === 'insertone@mongo.error') {
            return Promise.reject(Error('Mongo error (insertOne)'));
        }

        return Promise.resolve({
            insertedId: user._id,
        });
    },
    updateOne = () => {
        return Promise.resolve({
            upsertedId: user._id,
        });
    },
    db = {
        collection() {
            return {
                find,
                insertOne,
                updateOne,
            };
        },
    },
    init = new Promise((resolve) => {
        resolve();
    });

export default db;

export { init };
