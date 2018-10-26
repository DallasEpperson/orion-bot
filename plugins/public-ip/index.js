var request = require('request');

module.exports.PluginName = 'Public IP Checker';

module.exports.CanHandleMessage = function(messageText){
    return messageText.toLowerCase().includes('ip address');
};

module.exports.HandleMessage = function(event, sendMsg){
    request('http://whatismyip.akamai.com', function (error, response, body){
        sendMsg('The current IPv4 address of the server is ' + body, event.channel);
    });
};