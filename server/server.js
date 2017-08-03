const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Chatrooms} = require('./utils/chatrooms');

const publicPath = path.join(__dirname, '../public/');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users(); // Store all users in this instance of Users class
var rooms = new Chatrooms(); // store all rooms in this instance of Chatrooms class

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	var d = new Date();
	console.log('New user connected');

	socket.on('roomListToClient', (cb) => {
		cb(rooms.chatRooms.map( (room) => room.name ));
	});

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required.');
		}

		var roomLowerCase = params.room.toLowerCase();
		if (users.getUserList(roomLowerCase).find( (userName) => userName === params.name )) {
			return callback(`Sorry, nickname ${params.name} is already taken!`);
		}
		rooms.addUserToRoom(params.name, roomLowerCase);
		socket.join(roomLowerCase);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, roomLowerCase);

		io.to(roomLowerCase).emit('updateUserList', users.getUserList(roomLowerCase));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
		socket.broadcast.to(roomLowerCase).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
		callback();
	});

	socket.on('createMessage', (msg, callback) => {
		var user = users.getUser(socket.id);
		if (user && isRealString(msg.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
		}

		callback();
	});

	socket.on('createLocation', (coords) => {
		var user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if (user) {
			rooms.removeUserFromRoom(user.name, user.room);
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
		console.log('Client has disconnected!');
	});
});

server.listen(port, () => {
	console.log(`The server is up and running on port ${port}.`);
}); 