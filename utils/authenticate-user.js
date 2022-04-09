const readline = require('readline-sync')

const authenticateUser =(credentials) => {


    let keepChecking = true;
    let isAuthenticated = false;

    while (keepChecking && !isAuthenticated) {
        const username = readline.question('Please enter a username: ')
        const password = readline.question('Please enter the password: ')
        const filterResult = credentials.filter(credentialSet => isValidCredentials(credentialSet, username, password))
        if(filterResult.length > 0) {
            const userFound = filterResult[0];
            const index = credentials.findIndex(credentialSet => isValidCredentials(credentialSet, username, password));
            credentials[index].alreadyLoggedIn = true;

            keepChecking = false;
            isAuthenticated = true;
        } else {
            console.log("Invalid credentials")
            const retry = readline.question('Would you like to try again? Answer yes or no: ')
            if(retry.toLowerCase() === 'no') keepChecking = false;
            else if(retry.toLowerCase() === 'yes') keepChecking = true;
        }
    }
    return {
        isAuthenticated,
        updatedCredentials: credentials
    }
}

const isValidCredentials = (credentialSet, username, password) => {
    return credentialSet.username === username && credentialSet.password === password && credentialSet.alreadyLoggedIn === false
}

module.exports = {
    authenticateUser
}