var expect = require('chai').expect;
var utility = require('./utility.js');

describe('utility', function(){
    it('should exist', function() {
        expect(utility).to.not.be.undefined;
    })
})

describe('getWriteFileName', function() {
    it('should replace .asm extension with .hack extension', function() {
        var input = 'output.asm'
        var expected = utility.getWriteFileName(input);
        var actual = 'output.hack';

        expect(actual).to.equal(expected);
    });
});