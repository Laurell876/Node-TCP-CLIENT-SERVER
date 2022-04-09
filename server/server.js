const net = require('net');

const server = net.createServer()
const { authenticateUser } = require("./utils");
let {credentials} = require('../utils/data')

let numberOfUsersConnected = 0;
let clients = [];


const sendDataToAllClients = (msg) => {
    clients.forEach((client) => {
        client.write(msg);
    });
};

server.on('connection', (socket)=>{
    clients.push(socket);

    const authenticationData = authenticateUser(credentials);

    const {isAuthenticated, updatedCredentials} = authenticationData;
    credentials = updatedCredentials;

    if (isAuthenticated) {
        console.log("Logged In!")
        numberOfUsersConnected++;

        if (numberOfUsersConnected === 2) {
            console.log("The game has started")
            sendDataToAllClients("The game has started")
        }
    } else {
        console.log("Authentication failed!")
    }

    socket.on('data', (data)=>{
        socket.write('Received!')
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