const { authenticateUser } = require("./authenticate-user");
let {credentials} = require('./data');

const startGame = (sendDataToAllClients, numberOfUsersConnected, addUser, getClients, socket) => {
    const authenticationData = authenticateUser(credentials, socket);

    const {isAuthenticated, updatedCredentials} = authenticationData;
    credentials = updatedCredentials;

    if (isAuthenticated) {
        console.log("Logged In!")
        numberOfUsersConnected = addUser();

        if (numberOfUsersConnected === 2) {
            console.log("Find the Queen has started")
            sendDataToAllClients("Find the Queen has started")


            // decide who the dealer is and who the spotter is
            const clients = getClients();
            const dealerIndex = Math.round(Math.random()); // will return 0 or 1
            const spotterIndex = dealerIndex === 0 ? 1 : 0;
            const dealer = clients[dealerIndex];
            const spotter = clients[spotterIndex];
            
            dealer.write(JSON.stringify({
                type: "Notification",
                msg: "You are the dealer!"
            }));
            dealer.write(JSON.stringify({
                type: "Prompt",
                msg: "Please choose 1, 2 or 3."
            }))
            spotter.write(JSON.stringify({
                type: "Notification",
                msg: "You are the spotter!"
            }));

        }
    } else {
        console.log("Authentication failed!")
    }

}

module.exports  = {
    startGame
}