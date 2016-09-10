//SymbolTable.js
'use strict';

var SymbolTable;
//key-value table holding symbol representations
var symbols = {
    R0: 0,
    R1: 1,
    R2: 2,
    R3: 3,
    R4: 4,
    R5: 5,
    R6: 6,
    R7: 7,
    R8: 8,
    R9: 9,
    R10: 10,
    R11: 11,
    R12: 12,
    R13: 13,
    R14: 14,
    R15: 15,
    SCREEN: 16384,
    KBD: 24576,
    SP: 0,
    LCL: 1,
    ARG: 2,
    THIS: 3,
    THAT: 4
}

SymbolTable = {
    contains: function(symbol) {
        return (symbols[symbol] !== undefined);
    },
    
    getAddress: function(symbol) {
        if(SymbolTable.contains(symbol)) {
            return symbols[symbol];
        } else {
            return undefined;
        }
    },
    
    addEntry: function(key, value) {
        if(!SymbolTable.contains(key)) {
            symbols[key] = value;
        }
    }
};

module.exports = SymbolTable;