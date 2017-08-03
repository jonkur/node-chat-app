// Class for storing chat rooms and keeping track of users who have joined them
class Chatrooms {
	constructor() {
		this.chatRooms = [];
	}
	addRoom(roomName) {
		if (this.chatRooms.filter( (room) => room.name === roomName ).length === 0) {
			this.chatRooms.push({name: roomName, userList: []});
		}
	}
	addUserToRoom(userName, roomName) {
		this.addRoom(roomName);
		var chatRoom = this.chatRooms.find((room) => room.name === roomName);
		if (chatRoom.userList.filter((user) => user === userName).length === 0) {
			chatRoom.userList.push(userName);
		}
	}
	removeUserFromRoom(userName, roomName) {
		var room = this.chatRooms.find((room) => room.name === roomName);
		if (room) {
			room.userList = room.userList.filter( (user) => user !== userName );
			if (room.userList.length === 0) {
				this.chatRooms = this.chatRooms.filter((r) => r !== room);
			}
		}
	}
}

module.exports = {Chatrooms};