const appconfig = require('./app.config.json');
const { RTMClient, WebClient } = require('@slack/client');
const chalk = require('chalk');
const glob = require('glob');
const path = require('path');
const pluginPath = './plugins/';

let pluginFiles = glob.sync(path.join(pluginPath, '*/index.js'));
let loadedPlugins = [];
for (let i = 0; i < pluginFiles.length; i++) {
    let loadedPlugin = require('./' + pluginFiles[i]);
    loadedPlugins.push(loadedPlugin);
}

console.log('Loaded the following ' + loadedPlugins.length + ' plugins:');
for (let i = 0; i < loadedPlugins.length; i++) {
    console.log(loadedPlugins[i].PluginName);
}

const rtm = new RTMClient(appconfig.slackToken);
rtm.start();

let sendMsg = function(message, channel){
    rtm.sendMessage(message, channel)
        .then((msg) => console.log('Message sent to channel ' + channel + ': ' + message))
        .catch(console.error);
};

let processMessage = function(event){
    let chosenPlugin = undefined;
    for (let i = 0; i < loadedPlugins.length; i++) {
        if(loadedPlugins[i].CanHandleMessage(event.text)){
            chosenPlugin = loadedPlugins[i];
            break;
        }
    }

    if(chosenPlugin){
        chosenPlugin.HandleMessage(event, sendMsg);
    }else{
        sendMsg("I don't know how to handle that request.", event.channel);
    }
};

rtm.on('message', (event) => {
    let myId = rtm.activeUserId;
    if ( (event.subtype && event.subtype === 'bot_message') || (!event.subtype && event.user === myId) )
        return;
    
    console.log(`(channel:${event.channel}) ${event.user} says: ${event.text}`);
    
    if(event.channel.startsWith('DD')){ //Direct messages begin with DD
        processMessage(event);
    }else{ //Group (GD*) or channel (CD*) messages
        if(event.text.includes('<@' + myId + '>'))
            processMessage(event);
    }
});