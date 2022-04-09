const net = require('net');

const server = net.createServer()
const { startGame } = require('../utils/start-game');

let numberOfUsersConnected = 0;
let clients = [];


const sendDataToAllClients = (msg) => {
    clients.forEach((client) => {
        client.write(msg);
    });
};

const addUser = () => {
    numberOfUsersConnected++;
    return numberOfUsersConnected;
}

server.on('connection', (socket)=>{
    clients.push(socket);

    startGame(sendDataToAllClients, numberOfUsersConnected, addUser);

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