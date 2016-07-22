//parser-spec.js
'use strict';
var expect = require('chai').expect;
var Parser = require('./parser.js');

describe('Parser', function() {
    it('should exist', function() {
        expect(Parser).to.not.be.undefined;
    });
});

describe('commandType', function() {
   it('should return correct command type from line', function() {       
       var input = '@16';
       var expected = 'A_COMMAND';       
       var actual = Parser.commandType(input);
       
       expect(actual).to.equal(expected);
       
       input = '@48';
       expected = 'A_COMMAND'
       actual = Parser.commandType(input);
       expect(actual).to.equal(expected);
       
       input = '(LOOP)';
       expected = 'L_COMMAND';
       actual = Parser.commandType(input);
       expect(actual).to.equal(expected);
       
       input = 'M=M+1';
       expected = 'C_COMMAND';
       actual = Parser.commandType(input);
       expect(actual).to.equal(expected);
       
   });
});

describe('removeInlineComments', function() {
    it('should return command with inline comments removed', function() {
        var input = '@12 // this is a comment';
        var expected = '@12';
        var actual = Parser.removeComment(input);
        
        expect(actual).to.equal(expected);
        
        input = 'D=M              // D = first number';
        expected = 'D=M';
        actual = Parser.removeComment(input);
        expect(actual, 'Did not get D=M').to.equal(expected);
        
        input = 'M+1 //hello';
        expected = 'M+1';
        actual = Parser.removeComment(input);
        expect(actual).to.equal(expected);
    });
});

describe('parseCCommand', function() {
    it('should return an array with dest, comp, jump values', function() {
        var input = 'D=M+1';
        var expected = {
            'dest': 'D',
            'comp': 'M+1',
            'jump': 'null'
        };
        
        var actual = Parser.parseCCommand(input);
        expect(actual).to.eql(expected);

        input = '0;JMP';
        expected = {
            'dest': 'null',
            'comp': '0',
            'jump': 'JMP'
        }
        actual = Parser.parseCCommand(input);
        expect(actual).to.eql(expected);

        input = 'D=A';
        expected = {
            'dest': 'D',
            'comp': 'A',
            'jump': 'null'
        }

        actual = Parser.parseCCommand(input);
        expect(actual).to.eql(expected);
    });
});

describe('parseACommand', function() {
    it('should return value or symbol after "@" in A command', function() {
        var input = '@2';
        var expected = '2';
        var actual = Parser.parseACommand(input);
        expect(actual).to.equal(expected);

        var input = '@LOOP';
        var expected = 'LOOP';
        var actual = Parser.parseACommand(input);
        expect(actual).to.equal(expected);

        var input = 'hello';
        var expected = '';
        var actual = Parser.parseACommand(input);
        expect(actual).to.equal(expected);
    });
});

describe('getBinaryACommand', function() {
    it('should return binary instruction for A command', function() {
        var input = '@2';
        var expected = '0000000000000010';
        var actual = Parser.getBinaryACommand(input);
        expect(actual).to.equal(expected);
    });
});

describe('getBinaryCCommand', function() {
    it('should return binary instruction for C command', function() {
        var input = 'D=A';
        var expected = '1110110000010000';
        var actual = Parser.getBinaryCCommand(input);
        expect(actual).to.equal(expected);

        input = 'D=D+A';
        expected = '1110000010010000';
        actual = Parser.getBinaryCCommand(input);
        expect(actual).to.equal(expected);

        input = 'M=D';
        expected = '1110001100001000';
        actual = Parser.getBinaryCCommand(input);
        expect(actual).to.equal(expected);
    });
});

describe('parseLCommand', function() {
    it('should return symbol between parentheses in L Command', function() {
        var input = '(LOOP)';
        var expected = 'LOOP';
        var actual = Parser.parseLCommand(input);
        expect(actual).to.equal(expected);
    })
})


