const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
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

	socket.on('createMessage', (msg) => {
		console.log('New message from client:', msg);
		io.emit('newMessage', generateMessage(msg.from, msg.text));
		// socket.broadcast.emit('newMessage', {
		// 	from: msg.from,
		// 	text: msg.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('disconnect', () => {
		console.log('Client has disconnected!');
	});
});

server.listen(port, () => {
	console.log(`The server is up and running on port ${port}.`);
});