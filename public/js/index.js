var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('newMessage', function(msg) {
	var formattedTime = moment(msg.createdAt).format('HH:mm:ss a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: msg.text,
		from: msg.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(msg) {
	var formattedTime = moment(msg.createdA).format('HH:mm:ss');
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: msg.from,
		url: msg.url,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', function(e) {
	e.preventDefault();

	var messageTextBox = jQuery('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextBox.val()
	}, function() {
		messageTextBox.val('');
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocation', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function() {
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location.');
	});
});