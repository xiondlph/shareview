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

            insert: jest.fn()
                .mockImplementation((data, cb) => {
                    if (
                        data.email === 'user.create@nedb.insert.error.test'
                    ) {
                        cb(Error('Nedb error (insert)'));
                        return;
                    }
                    cb(null, user);
                }),

            update: jest.fn()
                .mockImplementation((qyery, data, cb) => {
                    console.log(qyery);
                    if (
                        qyery.email === 'user.forgot@nedb.update.error.test' ||
                        qyery.email === 'user.signin@nedb.update.error.test'
                    ) {
                        cb(Error('Nedb error (update)'));
                        return;
                    }
                    cb(null, user);
                }),
        };
    };

export default Nedb;

