'use strict';

var utility = {
    getWriteFileName: function(readFileName) {
        var re = /\.asm$/;
        return readFileName.replace(re, '.hack');
    }
}

module.exports = utility;