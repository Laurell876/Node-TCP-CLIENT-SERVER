const net = require('net');

const server = net.createServer()

server.on('connection', (socket)=>{
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