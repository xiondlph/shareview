const jwt = {
    sign() {
        return 'fake.token.success';
    },

    verify(token, secret, cb) {
        switch (token) {
            case 'fake.token.error':
                cb('fake.verify.error');
                break;

            case 'fake.token.invalid':
                cb('fake.verify.invalid');
                break;

            default:
                cb(null, {
                    _id: 'fake._id',
                    email: 'fake@user.com',
                });
        }
    },
};

export default jwt;

