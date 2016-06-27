//parser.js

var Parser;

Parser = {
    commandType: function(line) {
        //check for A command by looking for @ at beginning of line.
        var re = /^@/;
        if (re.exec(line)) {
            return 'A_COMMAND';
        }
    }
};

module.exports = Parser;