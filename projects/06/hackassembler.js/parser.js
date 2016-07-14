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
    },

    parseCommand: function(line) {
        var comp = '';
        var dest = 'null';
        var jump = 'null';

        var destMatch = line.split('=');
        var jmpMatch;
        //We have a dest 
        if (destMatch.length > 1) {
            dest = destMatch[0];
            //look for comp and jump
            jmpMatch = destMatch[1].split(';');
            comp = jmpMatch[0];
            if(jmpMatch[1]) jump = jmpMatch[1];
        }

        //Just have a comp and jump
        else {
            jmpMatch = line.split(';');
            comp = jmpMatch[0];
            if(jmpMatch[1]) jump = jmpMatch[1];
        }

        var component = {
            'dest': 'null',
            'comp': '',
            'jump': 'null'
        };
        component['dest'] = dest;
        component['comp'] = comp;
        component['jump'] = jump;

        return component;
    }
};

module.exports = Parser;