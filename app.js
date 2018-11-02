const appconfig = require('./app.config.json');
const { RTMClient, WebClient } = require('@slack/client');
const glob = require('glob');
const path = require('path');
const log = require('./logging');
const pluginPath = './plugins/';

log.internal("Orion-Bot Started.");

let pluginFiles = glob.sync(path.join(pluginPath, '*/index.js'));
let loadedPlugins = [];
for (let i = 0; i < pluginFiles.length; i++) {
    let loadedPlugin = require('./' + pluginFiles[i]);
    loadedPlugins.push(loadedPlugin);
}

let pluginLoadReport = 'Loaded the following ' + loadedPlugins.length + ' plugins:';
for (let i = 0; i < loadedPlugins.length; i++) {
    pluginLoadReport += '\n  ' + loadedPlugins[i].PluginName;
}
log.internal(pluginLoadReport);

const rtm = new RTMClient(appconfig.slackToken);

let sendMsg = function(message, channel){
    rtm.sendMessage(message, channel)
        .then((msg) => log.response(`Orion-Bot to ${channel}: ${message}`))
        .catch((reason) => log.error(reason));
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
    if ((event.subtype && event.subtype === 'bot_message') || (!event.subtype && event.user === myId))
        return;
        
    if(event.channel.startsWith('DD')){ //Direct messages begin with DD
        log.acknowledged(`${event.user} in ${event.channel} says: ${event.text}`);
        processMessage(event);
    }else if(event.text.includes('<@' + myId + '>')){ //Group (GD*) or channel (CD*) messages
        log.acknowledged(`${event.user} in ${event.channel} says: ${event.text}`);
        processMessage(event);
    }else{
        log.ignored(`${event.user} in ${event.channel} says: ${event.text}`);
    }
});

rtm.on('connected', () => {
    log.internal('Connected to Slack.');
});

rtm.on('connecting', () => {
    log.internal('Connecting to Slack...');
});

rtm.on('disconnected', () => {
    log.internal('Disconnected from Slack.');
});

rtm.on('disconnecting', () => {
    log.internal('Disconnecting from Slack...');
});

rtm.on('error', (err) => {
    log.error(`Slack error code: ${err.code}`);
});

rtm.on('reconecting', () => {
    log.internal('Connection to Slack lost. Reconnecting...');
});

rtm.start();