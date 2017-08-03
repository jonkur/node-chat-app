const expect = require('expect');

const {Chatrooms} = require('./chatrooms.js');

describe('Chatrooms', () => {

	var rooms = new Chatrooms();
	beforeEach( () => {
		rooms.chatRooms = [{
				name: 'Room One',
				userList: ['Jenny', 'Max']
			}, {
				name: 'Room Two',
				userList: ['Helen', 'Peter', 'Lorraine']
			}];
	} );

	it('should add a new room', () => {
		var roomName = 'Room Three';
		rooms.addRoom(roomName);
		expect(rooms.chatRooms.length).toBe(3);
		expect(rooms.chatRooms).toInclude({name: roomName, userList: []});
	});

	it('should not add a new room if room with same name exists', () => {
		var roomName = rooms.chatRooms[0].name;
		rooms.addRoom(roomName);
		expect(rooms.chatRooms.length).toBe(2);
	});

	it('should add new user to a room', () => {
		var roomName = rooms.chatRooms[0].name;
		rooms.addUserToRoom('Lorraine', roomName);
		expect(rooms.chatRooms[0].userList).toEqual(['Jenny', 'Max', 'Lorraine']);
	});

	it('should not add new user if user is already in room', () => {
		var roomName = rooms.chatRooms[0].name;
		rooms.addUserToRoom('Jenny', roomName);
		expect(rooms.chatRooms[0].userList.length).toBe(2);
		expect(rooms.chatRooms[0].userList).toNotBe(['Jenny', 'Max', 'Jenny']);
	});

	it('should remove a user from room', () => {
		 var roomName = rooms.chatRooms[1].name;
		 rooms.removeUserFromRoom('Peter', roomName);
		 expect(rooms.chatRooms[1].userList.length).toBe(2);
		 expect(rooms.chatRooms[1].userList).toEqual(['Helen', 'Lorraine']);
	});

	it ('should not remove any users from a room', () => {
		 var roomName = rooms.chatRooms[1].name;
		 rooms.removeUserFromRoom('Max', roomName);
		 expect(rooms.chatRooms[1].userList.length).toBe(3);
		 expect(rooms.chatRooms[1].userList).toEqual(['Helen', 'Peter', 'Lorraine']);
	});

	it ('should remove a room that no longer has any users', () => {
		 var roomName = rooms.chatRooms[0].name;
		 rooms.removeUserFromRoom('Jenny', roomName);
		 rooms.removeUserFromRoom('Max', roomName);
		 expect(rooms.chatRooms.length).toBe(1);
		 expect(rooms.chatRooms[0].name).toNotBe(roomName);
	});

});