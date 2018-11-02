const chalk = require('chalk');

module.exports = {
    acknowledged: function(message){
        console.log(`[${(new Date).getTime()}] ` + chalk.yellow(message));
    },
    error: function(message){
        console.log(`[${(new Date).getTime()}] ` + chalk.yellow(message));
    },
    ignored: function(message){
        console.log(`[${(new Date).getTime()}] ${message}`);
    },
    internal: function(message){
        console.log(`[${(new Date).getTime()}] ` + chalk.cyan(message));
    },
    response: function(message){
        console.log(`[${(new Date).getTime()}] ` + chalk.green(message));
    }
};