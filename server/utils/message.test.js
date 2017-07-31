const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var from = 'test_user';
		var text = 'Just some dummy text here';

		var res = generateMessage(from, text);
		expect(res.from).toBe(from);
		expect(res.text).toBe(text);
		expect(res.createdAt).toBeA('number');
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var from = 'test_user';
		var lat = 30.3553463;
		var lon = 15.4235345;

		var res = generateLocationMessage(from, lat, lon);
		expect(res.from).toBe(from);
		expect(res.url).toEqual(`https://www.google.com/maps?q=${lat},${lon}`);
		expect(res.createdAt).toBeA('number');
	});
});