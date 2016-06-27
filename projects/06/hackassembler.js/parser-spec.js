//parser-spec.js
'use strict';
var expect = require('chai').expect;

describe('Parser', function() {
    it('should exist', function() {
        var Parser = require('./parser.js');
        expect(Parser).to.not.be.undefined;
    });
});

describe('commandType', function() {
   it('should return correct command type from line', function() {
       var input = '@16';
       var expected = 'A_COMMAND';
       var Parser = require('./parser.js');
       var actual = Parser.commandType();
       
       expect(actual).to.equal(expected);
       
       
   }) 
});
