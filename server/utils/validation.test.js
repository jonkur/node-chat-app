const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		expect(isRealString(134)).toBe(false);
		expect(isRealString({test: "object"})).toBe(false);
		expect(isRealString([3, 5, "test"])).toBe(false);
	});

	it('should reject string with only spaces', () => {
		expect(isRealString('       ')).toBe(false);
	});

	it('should allow string with non-space characters', () => {
		expect(isRealString('test')).toBe(true);
		expect(isRealString('!#%&"!/(%##!=)&__!#¤!"§§')).toBe(true);
		expect(isRealString('    t  e    s    t     ')).toBe(true);
	});
});