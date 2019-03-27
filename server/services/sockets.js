
const initSocketConnection = (client) => {
    client.on('connection', function (socket) {
        console.log('A user connected!'); 

        socket.on('createGame', function (data) {
            console.log(' createGame ', data);
        });
    });
}

module.exports = {
    initSocketConnection
}