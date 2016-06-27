//symbolTable-spec.js

'use strict';
var expect = require('chai').expect;

describe('SymbolTable', function() {
    it('should exist', function() {
        var SymbolTable = require('./symbolTable.js');
        expect(SymbolTable).to.not.be.undefined;
    })
})

describe('ContainsSymbol', function() {
    it('should return boolean determining if symbol exists already', function() {
        var SymbolTable = require('./symbolTable.js');
        
        var input = 'R0';
        var expected = true;
        var actual = SymbolTable.contains(input);
        expect(actual).to.equal(expected);
        
        input = 'SCREEN';
        expected = true;
        actual = SymbolTable.contains(input);
        expect(actual).to.equal(expected);
        
        input = 'screen';
        expected = false;
        actual = SymbolTable.contains(input);
        expect(actual).to.equal(expected);
        
        input = 'hello';
        expected = false;
        actual = SymbolTable.contains(input);
        expect(actual).to.equal(expected);
    })
})

describe('GetSymbol', function() {
    it('should return symbol for label', function() {
        var SymbolTable = require('./symbolTable.js');
        
        var input = 'R0';
        var expected = 0;
        var actual = SymbolTable.getAddress(input);
        expect(actual).to.equal(expected);
        
        var input = 'hello';
        var expected = undefined;
        var actual = SymbolTable.getAddress(input);
        expect(actual).to.equal(expected);
    })
})

describe('AddEntry', function() {
    it('should add new entry to symbol table', function() {
        var SymbolTable = require('./symbolTable.js');
        
        var key = 'LOOP',
            value = 16;
        
        SymbolTable.addEntry(key, value);
        var expected = 16;
        var actual = SymbolTable.getAddress(key);
        expect(actual).to.equal(expected);
        
        key = 'R0';
        value = 20;
        SymbolTable.addEntry(key, value);
        var expected = 0;
        var actual = SymbolTable.getAddress(key);
        expect(actual).to.equal(expected);
        
        key = 'R19';
        value = 20;
        SymbolTable.addEntry(key, value);
        var expected = 20;
        var actual = SymbolTable.getAddress(key);
        expect(actual).to.equal(expected);
        
        key = 'kbd';
        value = 20;
        SymbolTable.addEntry(key, value);
        var expected = 20;
        var actual = SymbolTable.getAddress(key);
        expect(actual).to.equal(expected);
        
        key = 'KBD';
        value = 7483;
        SymbolTable.addEntry(key, value);
        var expected = 24576;
        var actual = SymbolTable.getAddress(key);
        expect(actual).to.equal(expected);
    })
})