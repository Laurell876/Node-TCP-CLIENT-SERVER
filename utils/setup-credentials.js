const setupCredentials = () => {
    const { USERNAME_1, USERNAME_2, PASSWORD_2, PASSWORD_1 } = process.env;
    const credentials = [
        {
            username: USERNAME_1,
            password: PASSWORD_1,
            alreadyLoggedIn: false
        },
        {
            username: USERNAME_2,
            password: PASSWORD_2,
            alreadyLoggedIn: false
        }
    ];

    return credentials
}


module.exports = {
    setupCredentials
}