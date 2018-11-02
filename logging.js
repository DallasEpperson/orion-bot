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
    },
    startup: function(){
        console.log(' * *');
        console.log('/ /');
        console.log(`**      ` + chalk.cyan('ORION') +`           *`);
        console.log(' \\                     *');
        console.log('  *                     \\');
        console.log('   \\    __/*\\            |');
        console.log('    *--/     \\           *');
        console.log('     \\        *----------*');
        console.log('      \\       /          *');
        console.log('       \\     |          *');
        console.log('        \\* * *\\        *');
        console.log('        |      *');
        console.log('       /        \\');
        console.log('      |          \\');
        console.log('     /     _____/*');
        console.log('    *-----/');
        console.log(`[${(new Date).getTime()}] Orion-Bot Started.`);
    }
};