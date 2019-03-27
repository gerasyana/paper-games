
module.exports = app => {
    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    io.set("origins", "*:*");

    io.on('connection', function (socket) {
        console.log('A user connected!'); // We'll replace this with our own events

        socket.on('createGame', function (data) {
            console.log(' createGame ', data);
        });
    });
}