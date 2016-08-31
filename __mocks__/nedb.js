/**
 * Мок для Nedb плагина
 */

const
    user = {
        period: 1471038756540,
    },
    Nedb = () => {
        return {
            loadDatabase: jest.fn(),

            insert(data, cb) {
                if (data.email === 'nedb.insert.error@email.ru') {
                    cb(Error('Nedb error (insert)'));
                }

                cb(null, user);
            },
            update(query, data, cb) {
                if (query.email === 'nedb.update.error@email.ru') {
                    cb(Error('Nedb error (update)'));
                }
                cb(null, user);
            },
        };
    };

export default Nedb;

