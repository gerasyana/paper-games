
const initConnection = (io) => {
    io.on('connection', (client) => {
        console.log('New user connected! ' + client.id);

        client.on('createRoom', function (data) {
            console.log(' createRoom ');
            const room = `${data.room}-room`;
            client.join(room);
            client.emit('roomCreated', {name: data.name, room: 'room-'+rooms});
        });

        client.on('disconnect', () => {
            console.log('User disconnected ' + client.id);
        })
    });
}

module.exports = {
    initConnection
}