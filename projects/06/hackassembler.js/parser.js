//parser.js
'use strict';

var Parser;

Parser = {
    commandType: function (line) {
        //check for A command by looking for '@' at beginning of line.
        var re = /^@/;
        if (re.test(line)) return 'A_COMMAND';
        
        //check for L command by looking for '('
        re = /\(/;
        if (re.test(line)) return 'L_COMMAND';    

        //else it is C command
        return 'C_COMMAND';
    },
    
    //remove any inline comments from instruction lines and trim them
    removeComment: function (line) {
        var re=/\/\/(.)*$/;
        var newline = line.replace(re, '').trim();
        return newline;
    }
};

module.exports = Parser;