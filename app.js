#!/usr/bin/env node
require('dotenv').config();

const {App: SlackApp, LogLevel} = require('@slack/bolt');
const glob = require('glob');
const path = require('path');
const log = require('./logging');

const slackApp = new SlackApp({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000,
    deferInitialization: true,
    logLevel: LogLevel.WARN
});

var loadedPlugins = [];

const loadPlugins = async () => {
    const pluginPath = './plugins/';
    let pluginFiles = glob.sync(path.join(pluginPath, '*/index.js'));
    for (let i = 0; i < pluginFiles.length; i++) {
        let loadedPlugin = require('./' + pluginFiles[i]);
        if(!loadedPlugin.init){
            loadedPlugins.push(loadedPlugin);
            continue;
        }
        try {
            loadedPlugin.init();
            loadedPlugins.push(loadedPlugin);
        } catch(initErr){
            log.error(`Plugin "${loadedPlugin.PluginName}" not loaded. Reason:\n${initErr}`);
        }
    }
    let pluginLoadReport = `Loaded the following ${loadedPlugins.length} plugins:`;
    for (let i = 0; i < loadedPlugins.length; i++) {
        pluginLoadReport += '\n  ' + loadedPlugins[i].PluginName;
    }
    log.internal(pluginLoadReport);
};

(async () => {
    log.startup();
    await loadPlugins();
    await slackApp.init();
    await slackApp.start();
    log.internal("Connected to Slack.");
})();








// const rtm = new RTMClient(appconfig.slackToken);

// let sendMsg = function(message, channel){
//     rtm.sendMessage(message, channel)
//         .then((msg) => log.response(`Orion-Bot to ${channel}: ${message}`))
//         .catch((reason) => log.error(reason));
// };

// let processMessage = function(event){
//     let chosenPlugin = undefined;
//     for (let i = 0; i < loadedPlugins.length; i++) {
//         if(loadedPlugins[i].CanHandleMessage(event.text)){
//             chosenPlugin = loadedPlugins[i];
//             break;
//         }
//     }

//     if(chosenPlugin){
//         chosenPlugin.HandleMessage(event, sendMsg);
//     }else{
//         sendMsg("I don't know how to handle that request.", event.channel);
//     }
// };

// rtm.on('message', (event) => {
//     let myId = rtm.activeUserId;
//     if ((!event.subtype && event.user === myId))
//         return;
    
//     if(event.subtype){
//         switch(event.subtype){
//             case 'bot_message':
//             case 'channel_archive':
//             case 'channel_join':
//             case 'channel_leave':
//             case 'channel_name':
//             case 'channel_purpose':
//             case 'channel_topic':
//             case 'channel_unarchive':
//             case 'file_comment':
//             case 'file_mention':
//             case 'file_share':
//             case 'group_archive':
//             case 'group_join':
//             case 'group_leave':
//             case 'group_name':
//             case 'group_purpose':
//             case 'group_topic':
//             case 'group_unarchive':
//             case 'me_message':
//             case 'message_changed':
//             case 'message_deleted':
//             case 'message_replied':
//             case 'pinned_item':
//             case 'reply_broadcast':
//             case 'thread_broadcast':
//             case 'unpinned_item':
//                 return;
//             default:
//                 break;
//         }
//     }
        
//     if(event.channel.startsWith('D')){ //Direct messages begin with D
//         log.acknowledged(`${event.user} in ${event.channel} says: ${event.text}`);
//         processMessage(event);
//     }else if(event.text.includes('<@' + myId + '>')){ //Group (GD*) or channel (CD*) messages
//         log.acknowledged(`${event.user} in ${event.channel} says: ${event.text}`);
//         processMessage(event);
//     }else{
//         log.ignored(`${event.user} in ${event.channel} says: ${event.text}`);
//     }
// });

// rtm.on('connected', () => {
//     log.internal('Connected to Slack.');
// });

// rtm.on('connecting', () => {
//     log.internal('Connecting to Slack...');
// });

// rtm.on('disconnected', () => {
//     log.internal('Disconnected from Slack.');
// });

// rtm.on('disconnecting', () => {
//     log.internal('Disconnecting from Slack...');
// });

// rtm.on('error', (err) => {
//     log.error(`Slack error code: ${err.code}`);
// });

// rtm.on('reconecting', () => {
//     log.internal('Connection to Slack lost. Reconnecting...');
// });

// rtm.start();