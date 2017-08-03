var socket = io();

socket.on('connect', function() {

	socket.emit('roomListToClient', function(roomList) {
		roomList.forEach( (room) => {
			jQuery('#rooms_list').append(`<option value="${room}">`);
		} );
	});

});