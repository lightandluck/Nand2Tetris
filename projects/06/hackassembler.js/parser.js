//parser.js
'use strict';

var Parser;

Parser = {
    commandType: function (line) {
        //check for A command by looking for @ at beginning of line.
        var re = /^@/;
        if (re.test(line)) return 'A_COMMAND';
        
        re = /\(/;
        if (re.test(line)) return 'L_COMMAND';    

        return 'C_COMMAND';
    },
    
    removeComment: function (line) {
        var re=/\/\/(.)*$/;
        var newline = line.replace(re, '').trim();
        return newline;
    }
};

module.exports = Parser;