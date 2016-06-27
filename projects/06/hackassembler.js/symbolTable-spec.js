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
        var actual = SymbolTable.con
    })
})