const jwt = {
    sign() {
        return 'fake.token';
    },

    verify(token, secret, cb) {
        cb('fake.verify.error');
    },
};

export default jwt;

