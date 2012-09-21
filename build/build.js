var compressor = require('node-minify'),
    less = require('less'),
    fs = require('fs');

var jsFiles = ['js/libs/historyjs/history.adapter.jquery.js',
               'js/libs/historyjs/json2.js',
               'js/libs/historyjs/history.html4.js',
               'js/libs/historyjs/history.js',

];


// Compress libs (some cannot)
new compressor.minify({
    type: 'gcc',
    fileIn: jsFiles,
    fileOut: 'js/libs/jquery.history.min.js',
    callback: function(err){
        console.log("Script finit de minimifier:: ",err);
    }
});

