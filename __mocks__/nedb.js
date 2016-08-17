const
    NedbUser = {
        period: 1471038756540
    },
    Nedb = () => {
        return {
            loadDatabase: jest.fn(),
            findOne: jest.fn()
                .mockImplementationOnce((query, cb) => cb(NedbUser)),

            insert: jest.fn()
                .mockImplementationOnce((data, cb) => cb(null, NedbUser)),
        };
    };

export default Nedb;
