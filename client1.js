const net = require('net');
const readline = require('readline-sync')

const options = {
    port: 7621,
    host: '127.0.0.1'
}

const client = net.createConnection(options)

client.on('connect', ()=>{
    console.log('Connected to server')
    sendLine()
})

client.on('data', (data)=>{
    console.log('Data sent: ' + data)
    sendLine()
})

client.on('error', (err)=>{
    console.log(err.message)
})

function sendLine() {
    var line = readline.question('\nEnter a message\t')
    if (line == "0") {
        client.end()
    }else{
        client.write(line)
    }
}