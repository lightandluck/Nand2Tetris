'use strict';

var expect = require('chai').expect;
var Code = require('./code.js');

describe('Code module', function() {
    it('it should exist', function() {
        expect(Code).to.not.be.undefined;
    });    
});

describe('Creates binary strings from numbers', function() {
    it('should return 16-bit binary representation of decimal number', function() {
        var input = 1;
        var expected = '0000000000000001';
        var actual = Code.createBinaryString(input);
        expect(actual).to.equal(expected);

        input = 16;
        expected = '0000000000010000';
        actual = Code.createBinaryString(input);
        expect(actual).to.equal(expected);

        input = '16';
        expected = '0000000000010000';
        actual = Code.createBinaryString(input);
        expect(actual).to.equal(expected);
    });
});

describe('Get computation code', function() {
    it('should return 7-bit string corresponding to correct computation', function() {
        var input = '0';
        var expected = '0101010';
        var actual = Code.getComp(input);
        expect(actual).to.equal(expected);
    });
});
