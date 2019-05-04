const chai = require('chai');
const chaiHttp = require('chai-http');
const socketIOClient = require("socket.io-client");

const { expect } = chai;
chai.use(chaiHttp);

const port = process.env["PORT"] || 3030;
var io = require("socket.io").listen(port);

describe('Sockets', async () => {
    it('It should connect user 1 ', async () => {
        const ioServer = require('../services/socket')(io);
        ioServer.initConnection();

        const socket = await socketIOClient.connect("http://localhost:5000");

        await socket.once("connect", async () => {
            socket.on('setUserId', () => {
                console.log('connected user 2')
            });
        });
    });
})
