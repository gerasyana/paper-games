const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');
const { initSocketConnection } = require('./services/sockets');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.Server(app);
const client = socketIO(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./mongoose');
require('./routes')(app);
initSocketConnection(client);

server.listen(PORT, () => console.log(`Server start running on ${PORT}`));
