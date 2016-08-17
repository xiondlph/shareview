const
    nodemailer = {
        createTransport() {
            return {
                sendMail: jest.fn()
                    .mockImplementationOnce((options, cb) => cb(null)),
            };
        },
    };

export default nodemailer;
