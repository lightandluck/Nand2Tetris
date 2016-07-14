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

    it('should be a pending test');
});

describe('parseCommand', function() {
    it('should return an array with dest, comp, jump values', function() {
        var input = 'D=M+1';
        var expected = {
            'dest': 'D',
            'comp': 'M+1',
            'jump': 'null'
        };
        
        var actual = Parser.parseCommand(input);
        expect(actual).to.eql(expected);

        input = '0;JMP';
        expected = {
            'dest': 'null',
            'comp': '0',
            'jump': 'JMP'
        }
        actual = Parser.parseCommand(input);
        expect(actual).to.eql(expected);
    });
});


