/**
 * Мок для Nedb плагина
 */

const
    NedbUser = {
        period: 1471038756540,
    },
    Nedb = () => {
        return {
            loadDatabase: jest.fn(),

            insert: jest.fn()
                .mockImplementation((data, cb) => {
                    if (data.email === 'user.create@nedb.insert.error.test') {
                        cb(Error('Nedb error (insert)'));
                        return;
                    }
                    cb(null, NedbUser);
                }),
        };
    };

export default Nedb;

