const { authenticateUser } = require("./authenticate-user");
let {credentials} = require('../utils/data');

const startGame = (sendDataToAllClients, numberOfUsersConnected, addUser) => {
    console.log(numberOfUsersConnected)
    const authenticationData = authenticateUser(credentials);

    const {isAuthenticated, updatedCredentials} = authenticationData;
    credentials = updatedCredentials;

    if (isAuthenticated) {
        console.log("Logged In!")
        numberOfUsersConnected = addUser();

        if (numberOfUsersConnected === 2) {
            console.log("The game has started")
            sendDataToAllClients("The game has started")
        }
    } else {
        console.log("Authentication failed!")
    }

}

module.exports  = {
    startGame
}