//parser.js
'use strict';

var Parser;
var Code = require('./code.js');
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

    parseCCommand: function(line) {
        var dest = 'null';
        var comp = '';        
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
            'dest': dest,
            'comp': comp,
            'jump': jump
        };        

        return component;
    },

    parseACommand: function(line) {
        var match = line.split('@');
        if (match.length > 1) {
            return match[1];
        }
        return '';
    },

    parseLCommand: function(line) {
        var re = /\((.*?)\)/;
        var match = re.exec(line);
        if (match.length > 1) {
            return match[1];
        }
        return '';
    },

    getBinaryACommand: function(line) {
        var value = this.parseACommand(line);
        return Code.createBinaryString(value);
    },

    getBinaryCCommand: function(line) {
        var values = this.parseCCommand(line);
        return ['111',                
                Code.getComp(values['comp']),
                Code.getDest(values['dest']),
                Code.getJmp(values['jump']),
        ].join('');
    }
};

module.exports = Parser;