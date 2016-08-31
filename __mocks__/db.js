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
    find = (query) => {
        return {
            limit() {
                return {
                    toArray() {
                        if (query.sid === 'error' || query.email === 'mongo.find.error@email.ru') {
                            return Promise.reject(Error('Mongo error (find)'));
                        }

                        if (query.sid === 'authorized') {
                            return Promise.resolve([user]);
                        }

                        return Promise.resolve([]);
                    },
                };
            },
        };
    },
    insertOne = (record) => {
        if (record.email === 'mongo.insertone.error@email.ru') {
            return Promise.reject(Error('Mongo error (insertOne)'));
        }

        return Promise.resolve({
            insertedId: user._id,
        });
    },

    updateOne = (query, data) => {
        if (query.email === 'mongo.updateone.error@email.ru') {
            return Promise.reject(Error('Mongo error (updateOne)'));
        }

        if (query.email === 'mongo.updateone.nomodified@email.ru') {
            return Promise.resolve({
                upsertedId: user._id,
                result: {
                    nModified: 0,
                },
            });
        }

        return Promise.resolve({
            upsertedId: user._id,
            result: {
                nModified: 1,
            },
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
