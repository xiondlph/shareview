const
    user = {
        _id: '57acf3a493f8f719f4aa6423',
    },
    find = query => {
        return {
            limit() {
                return {
                    toArray() {
                        if (query.email && query.email === 'find@mongo.error') {
                            return Promise.reject(Error('Mongo error (find)'));
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
    db = {
        collection() {
            return {
                find,
                insertOne,
            };
        },
    },
    init = new Promise((resolve) => {
        resolve();
    });

export default db;

export { init };
