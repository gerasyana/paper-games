const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./init-scripts/mongoose');
require('./init-scripts/routes')(app);

const client = require('./services/socket')(io);
client.initConnection();

server.listen(PORT, () => console.log(`Server start running on ${PORT}`));
