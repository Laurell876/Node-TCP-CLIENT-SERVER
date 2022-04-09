const net = require('net');
const server = net.createServer()
const { startGame } = require('./utils/start-game');
let {credentials} = require('./utils/data');

let numberOfUsersConnected = 0;
let clients = [];
const readline = require("readline-sync");


const sendDataToAllClients = (msg) => {
    clients.forEach((client) => {
        client.write(JSON.stringify({
            type: "Notification",
            msg
        }));
    });
};

const addUser = () => {
    numberOfUsersConnected++;
    return numberOfUsersConnected;
}

const getClients = () => {
    return clients;
}

const setCredentials = (updatedCredentials) => {
    credentials = updatedCredentials;
}



server.on('connection', (socket)=>{
    clients.push(socket);

   // startGame(sendDataToAllClients, numberOfUsersConnected, addUser, getClients, socket);
   socket.write(JSON.stringify({
        type: "login",
        data: {
            credentials
        }
    }))

    socket.on('data', (data)=>{
        const objectData = JSON.parse(data);
        console.log(objectData);

        if(objectData && objectData.type) {
            if (objectData.type === "update-credentials") {
                setCredentials(objectData.data.credentials);
            } else if (objectData.type === "attempt-login") {
                const authData = objectData.data;
                const {username, password} = authData;
                console.log(username)
                console.log(password)

                const filterResult = credentials.filter(credentialSet => isValidCredentials(credentialSet, username, password))

                if(filterResult.length > 0) {
                    const userFound = filterResult[0];
                    const index = credentials.findIndex(credentialSet => isValidCredentials(credentialSet, username, password));
                    credentials[index].alreadyLoggedIn = true;

                    keepChecking = false;
                    isAuthenticated = true;
                    console.log("AUTHENTICATED")
                } else {
                    //console.log("Invalid credentials")

                    socket.write(JSON.stringify({
                        type: "retry-login"
                    }))

                    // const retry = readline.question('Would you like to try again? Answer yes or no: ')
                    // if(retry.toLowerCase() === 'no') {
                    //     // keepChecking = false;
                    // }
                    // else if(retry.toLowerCase() === 'yes') {
                    //     socket.write(JSON.stringify({
                    //         type: "retry-login"
                    //     }))
                    // }


                }
            }
        }
    })

    socket.on('close', ()=>{
        console.log('Server connection closed')
    })

    socket.on('error', (err)=>{
        console.log(err.message)
    })
})

server.listen(7621, ()=>{
    console.log('Server started on port: ', server.address().port)
})


const isValidCredentials = (credentialSet, username, password) => {
    return credentialSet.username === username && credentialSet.password === password && credentialSet.alreadyLoggedIn === false
}