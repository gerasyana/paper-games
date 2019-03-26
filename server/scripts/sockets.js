
module.exports = app => {
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    io.on('connection', function (socket) {
        console.log('A user connected!'); // We'll replace this with our own events

        socket.on('createGame', function (data) {
            socket.join('room-' + ++rooms);
            socket.emit('newGame', { name: data.name, room: 'room-' + rooms });
        });

        /**
         * Connect the Player 2 to the room he requested. Show error if room full.
         */
        socket.on('joinGame', function (data) {
            var room = io.nsps['/'].adapter.rooms[data.room];
            if (room && room.length == 1) {
                socket.join(data.room);
                socket.broadcast.to(data.room).emit('player1', {});
                socket.emit('player2', { name: data.name, room: data.room })
            }
            else {
                socket.emit('err', { message: 'Sorry, The room is full!' });
            }
        });

        /**
         * Handle the turn played by either player and notify the other. 
         */
        socket.on('playTurn', function (data) {
            socket.broadcast.to(data.room).emit('turnPlayed', {
                tile: data.tile,
                room: data.room
            });
        });

        /**
         * Notify the players about the victor.
         */
        socket.on('gameEnded', function (data) {
            socket.broadcast.to(data.room).emit('gameEnd', data);
        });
    });
}