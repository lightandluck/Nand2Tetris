//Code.js
var Code = {
    createBinaryString:  function(nMask) {
        // nMask must be between -2147483648 and 2147483647
        for (var nFlag = 0, nShifted = nMask, sMask = ""; nFlag < 32;
            nFlag++, sMask += String(nShifted >>> 31), nShifted <<= 1);
        return sMask.substr(-16);
    },

    getComp: function(symbol) {
        return comp[symbol];
    },

    getDest: function(symbol) {
        return dest[symbol];
    },

    getJmp: function(symbol) {
        return jump[symbol];
    }
};

var comp = {
    '0':    '0101010',
    '1':    '0111111',
    '-1':   '0111010',
    D:      '0001100',
    A:      '0110000',
    M:      '1110000',
    '!D':   '0001101',
    '!A':   '0110001',
    '!M':   '1110001',
    'D+1':  '0011111',
    '-D':   '0001111',
    '-A':   '0110001',
    '-M':   '1110011',
    'A+1':  '0110111',
    'M+1':  '1110111',
    'D-1':  '0001110',
    'A-1':  '0110010',
    'M-1':  '1110010',
    'D+A':  '0000010',
    'D+M':  '1000010',
    'D-A':  '0010011',
    'D-M':  '1010011',
    'A-D':  '0000111',
    'M-D':  '1000111',
    'D&A':  '0000000',
    'D&M':  '1000000',
    'D|A':  '0010101',
    'D|M':  '1010101'
};

var dest = {
    'null': '000',
    'M':    '001',
    'D':    '010',
    'MD':   '011',
    'A':    '100',
    'AM':   '101',
    'AD':   '110',
    'AMD':  '111',
    'DM':   '011',
    'MA':   '101',
    'DA':   '110',
    'ADM':  '111',
    'MAD':  '111',
    'MDA':  '111',
    'DMA':  '111',
    'DAM':  '111'
};

var jump = {
    'null': '000',
    'JGT':  '001',
    'JEQ':  '010',
    'JGE':  '011',
    'JLT':  '100',
    'JNE':  '101',
    'JLE':  '110',
    'JMP':  '111'
};

module.exports = Code;
