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

    /**Prints startup constellation
     */
    startup: function(){
        var constellation = chalk`
{white  * *}
/ /
{white **}      {cyan ORION}
 \\                     {white *}
  {white *}                     \\
   \\    __/{white *}\\            |
    {white *}--/     \\           {white *}
     \\        {white *}----------{white *}
      \\       /          {white *}
       \\     |          {white *}
        \\{white * * *}\\        {white *}
        |      {white *}
       /        \\
      |          \\
     /     _____/{white *}
    {white *}-----/
    {cyan Version ${require('./package.json').version}}`;
        console.log(chalk.gray(constellation));
        console.log(`[${(new Date).getTime()}] Orion-Bot Started.`);
    }
};