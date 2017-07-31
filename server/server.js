const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	var d = new Date();
	console.log('New user connected');

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chatroom!'));

	socket.on('createMessage', (msg, callback) => {
		console.log('New message from client:', msg);
		io.emit('newMessage', generateMessage(msg.from, msg.text));
		callback();
	});

	socket.on('createLocation', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('Client has disconnected!');
	});
});

server.listen(port, () => {
	console.log(`The server is up and running on port ${port}.`);
});